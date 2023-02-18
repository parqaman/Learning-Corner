import { Request, Response } from 'express';
import Multer from 'multer';
import path from 'path';
// const path = require('path');
const uploadPath = path.join(__dirname, process.env.STORAGE_PATH || '../../upload');

const tmpStorage = Multer.diskStorage({
  destination(req: Request, file: Express.Multer.File, cb: (error: any, destination: string) => void) {
    cb(null, path.join(uploadPath, 'tmp'));
  },
  filename(req: Request, file: Express.Multer.File, cb: (error: any, filename: string) => void) {
    try {
      cb(null, Date.now() + path.extname(file.originalname));
    } catch (e) {
      cb(e, 'error');
    }
  },
});

const profileStorage = Multer.diskStorage({
  destination(req: Request, file: Express.Multer.File, cb: (error: any, destination: string) => void) {
    cb(null, path.join(uploadPath, 'profile'));
  },
  filename(req: Request, file: Express.Multer.File, cb: (error: any, filename: string) => void) {
    try {
      cb(null, Date.now() + path.extname(file.originalname));
    } catch (e) {
      cb(e, 'err');
    }
  },
});

const imageFilter = (req: Request, file: Express.Multer.File, callback: (error: any, acceptFile: boolean) => void) => {
  const imageFormat = file.mimetype.split('/');
  if (imageFormat[0] !== 'image') return callback(new Error(`Uploaded file was not an image!`), false);
  callback(null, true);
};

export const uploadProfilePicture = (req: Request, res: Response, next: () => void) => {
  const upload = Multer({
    storage: profileStorage,
    limits: { fileSize: 5242880 },
    fileFilter: imageFilter,
  }).any();

  upload(req, res, (err: any) => {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any
    if (err) {
      return res.status(500).send(err.message);
    }
    next();
  });
};

export const uploadFile = (req: Request, res: Response, next: () => void) => {
  const upload = Multer({
    storage: tmpStorage,
    limits: { fileSize: 5242880 },
  }).any();

  upload(req, res, (err: any) => {
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any
    if (err) {
      return res.status(500).send(err.message);
    }
    next();
  });
};
