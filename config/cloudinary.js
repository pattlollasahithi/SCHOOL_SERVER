import multer from 'multer';

// Use memory storage to store files in memory so we can base64 encode them
// This avoids needing Cloudinary or local disk storage on Vercel
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

export default upload;
