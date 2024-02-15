// Librería para la gestión de ficheros
import multer from 'multer';
// Librería para trabjar con cloudinary
import { config, v2 as cloudinary } from 'cloudinary';
// Guardado en la store de Cloudinary
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// COnfiguración de nuestra storage -> nuestra carpeta de imgs  : formatos permitidos
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'bips',
        allowedFormats: ['jpg', 'png', 'jpeg', 'gif']
    }
})

// multer se encarga de gestionar dicha carpeta
export const upload = multer({ storage });
