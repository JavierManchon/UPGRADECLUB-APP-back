import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../libs/jwt.js';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const register = async (req,res) => {
    const { email, password, username} = req.body;

    try {

        //Estas dos lineas se ponen para asegurar la validacion desde el front
        const userFound = await User.findOne({email});
        console.log(userFound);
        if (userFound) return res.status(400).json({message: 'Email already exists in DB'});

        //REVISAR: Para imagen de usuario
        const userPicture = req.file ? req.file_url : null;

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: passwordHash,
            picture: userPicture,
        });
    
        const userSaved = await newUser.save();
        const token = await generateToken({id: userSaved._id});
        //Lo qu ele estamos diciendo es que el front use solo lo que necesita, ene ste caso el id, el username y la contraseña, no necesita mas info
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            picture: userSaved.picture,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserByToken = async (req, res, next) => {
    console.log(req.headers.authorization);
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Authorization token is missing' });
        }

        const tokenWithoutBearer = token.replace('Bearer ', '');
        const decodedToken = jwt.verify(tokenWithoutBearer, TOKEN_SECRET);

        // Suponiendo que el token contiene el ID del usuario
        const userId = decodedToken.id;
        const userLogued = await User.findOne({ _id: userId });

        if (!userLogued) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(userLogued);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const patchUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { username } = req.body;
        let picture = req.file ? req.file.path : null;
        const userToUpdate = {
            username
        }
        if (picture) {
            userToUpdate.picture = picture
        }
        const updatedUser = await User.findByIdAndUpdate(id, userToUpdate, { new: true });
        
        return res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const login = async (req, res, next) => {

    try {
        // Comprobamos que existe el email para logarse
        const user = await User.findOne({ email: req.body.email });

        if (await user.passwordCheck(req.body.password)) {
                 // Generamos el Token
            const token = generateToken(user._id, user.email);
            user.token = token;
            await user.save()
            // Devolvemos el Token al Frontal
            return res.json(user);
        } else {
            return res.status(401).json({msg: error.message})
        }      
    } catch (error) {
        return res.status(401).json({msg: error.message})
    }
};

export const logout = async (req,res) => {
    res.cookie('token', '', {
        expires: new Date(0)
    })
    return res.sendStatus(200);
};

export const profile = async(req, res) => {
    try {
        const userFound = await User.findById(req.user.id);

        if (!userFound) {
            return res.status(400).json({message: 'User not found'}); 
        }

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt
        });
    } catch (error) {
        return res.status(500).json({message: 'Internal Server Error'});
    }
};

/*export const verifyToken = async (req, res) => {
    const {token} = req.cookies;
    console.log('Token recibido en el backend:', token);

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' });

        const userFound = await User.findById(user.id);
        if (!userFound) return res.status(401).json({ message: 'Unauthorized' });

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email
        });

    })
}*/