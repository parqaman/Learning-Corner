import { Request, Response } from "express";
import Multer from "multer";
const path = require('path');
const uploadPath = path.join(__dirname, process.env.STORAGE_PATH || '../../upload/tmp');

const storage = Multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: Function) {
        cb(null, uploadPath)
    },
    filename: function (req: Request, file: Express.Multer.File, cb: Function) {
        try {
            cb(null, Date.now() + path.extname(file.originalname))
        } catch (e) {
            cb(e);
        }
    }
});
const imageFilter = function(req: Request, file: Express.Multer.File, callback: Function) {
    const imageFormat = file.mimetype.split("/");
    if(imageFormat[0] !== 'image') return callback(new Error(`Uploaded file was not an image!`));
    callback(null, true);
}

export const uploadProfilePicture = (req: Request, res: Response, next: Function) => {
    const upload = Multer({
        storage: storage,
        limits: { fileSize: 1000000 }, //1MB limit
        fileFilter: imageFilter,
    }).any();


    upload(req, res, function(err: any) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        if(err){
            return res.status(500).send(err.message);
        }
        next()
    });
}