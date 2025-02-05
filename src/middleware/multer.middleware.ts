import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../..', 'uploads')); 
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); 
    cb(null, Date.now() + ext); 
  }
});


const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(null, false); 
  }
};

export const upload = multer({ storage, fileFilter });
