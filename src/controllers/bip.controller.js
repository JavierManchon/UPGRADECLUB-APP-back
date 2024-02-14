import Bip from '../models/bip.model.js';
import User from '../models/user.model.js';

export const getBips = async (req, res) => {
    const bips = await Bip.find({
        //Me da solo los comentarios del usuario asociado
        user: req.user.id
    }).populate('comments');
    res.json(bips);
    console.log(res.json(bips));
};

//Esta funcion simplifica la anterior para darme todos los usuarios
export const getAllBips = async (req, res) => {
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

    try {
    const bipPicture = req.file ? req.file_url : null;
    const {content, category} = req.body; // obtengo los datos a traves del body

    console.log(req.user);

    const newBip = new Bip({
        content,
        category,
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
  


export const updateBip = async (req, res) => {
    try {
      const bipId = req.params.id; 
      const updateData = req.body; // Necesito obtener los datos actualizados a traves del body
  
      // Actualizar el bip por su Id
      const updatedBip = await Bip.findByIdAndUpdate(bipId, updateData, { new: true });
  
      if (!updatedBip) {
        return res.status(404).json({
          success: false,
          message: 'Bip not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Bip updated successfully',
        bip: updatedBip,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };