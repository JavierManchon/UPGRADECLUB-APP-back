import { config, v2 as cloudinary } from 'cloudinary';

export const configCloudinary = () => {
    cloudinary.config({
        cloud_name: 'dbckjkikz',
        api_key: '523154699687456',
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
}