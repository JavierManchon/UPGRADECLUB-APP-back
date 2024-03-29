import Bip from '../models/bip.model.js';
import User from '../models/user.model.js';

export const getBips = async (req, res) => {
    const bips = await Bip.find({
        //Me da solo los comentarios del usuario asociado
        user: req.user.id
    }).populate('comments');
    res.json(bips);
};

//Esta funcion simplifica la anterior para darme todos los bips
export const getAllBips = async (req, res) => {
  const allBips = await Bip.find().populate('comments');
  console.log(allBips);
  try {
      const allBips = await Bip.find().populate('comments');
      res.json(allBips);
  } catch (error) {
      res.status(500).json({
          success: false,
          message: 'Internal server error',
      });
  }
};

export const createBip = async (req, res) => {
    console.log(req.file);
    try {
    const bipPicture = req.file ? req.file.path : null;
    const {content, categories} = req.body; // obtengo los datos a traves del body

    console.log(req.user);

    // Convierto la cadena de categorías en un array, ya que para pasarla por el form data me oblica a que sea un string
    //const categoriesArray = categories.split(',');

    const newBip = new Bip({
        content,
        categories,
        picture: bipPicture,
        //Este dato se recupera del jwt.verify en Validate Token
        user: req.user.id
    })
    await newBip.save()

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { $push: { bips: newBip._id } },
        { new: true }
      );
  
      // Una vez he creado el nuevo bip y lo he guardado, lo añado a la lista de bips que tenga a traves del Id que he generado
      //Lo siguiente es geenrar la respuesta que me da el servidor
      res.status(201).json({
        success: true,
        message: 'Bip added successfully',
        bip: newBip,
        user: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
};


export const getBip = async (req, res) => {
    try {
      const bipId = req.params.id; // Si necesito el id, obtengo el id del bip a traves de la url
  
      // Busco el bip por su id y le relleno la parte de comentarios con los comentarios asociados a el
      const bip = await Bip.findById(bipId).populate('comments');
  
      if (!bip) {
        return res.status(404).json({
          success: false,
          message: 'Bip not found',
        });
      }
  
      // Envio el bip al cliente
      res.status(200).json({
        success: true,
        bip: bip,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };

  export const deleteBip = async (req, res) => {
    try {
      const bipId = req.params.id;
  
      const deletedBip = await Bip.findByIdAndDelete(bipId);
  
      if (!deletedBip) {
        return res.status(404).json({
          success: false,
          message: 'Bip not found',
        });
      }
  
      console.log('Deleted bip:', deletedBip);
  
      res.status(200).json({
        success: true,
        message: 'Bip deleted successfully',
        bip: deletedBip,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
  


  export const patchLikes = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { likes } = req.body;
        const bipToUpdate = {
            likes
        }
        const updatedBip = await Bip.findByIdAndUpdate(id, bipToUpdate, { new: true });
        
        return res.status(200).json(updatedBip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}