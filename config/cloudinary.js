import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

let storage;

const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                     process.env.CLOUDINARY_API_KEY && 
                     process.env.CLOUDINARY_API_SECRET;

if (useCloudinary) {
    console.log('☁️ Using Cloudinary for storage');
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (req, file) => {
        let folder = 'shrradha-school';
        let resource_type = 'auto';
        
        if (file.mimetype === 'application/pdf') {
            resource_type = 'raw';
            folder = 'shrradha-notices';
        } else {
            folder = 'shrradha-achievements';
        }

        return {
          folder: folder,
          resource_type: resource_type,
          public_id: Date.now() + '-' + file.originalname.split('.')[0],
        };
      },
    });
} else {
    console.warn('📁 Cloudinary keys missing. Falling back to LOCAL storage (./uploads)');
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = './uploads';
            if (!fs.existsSync(dir)) fs.mkdirSync(dir);
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    });
}

const upload = multer({ storage: storage });

export default upload;
