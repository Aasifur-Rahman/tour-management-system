// import v2 first as cloudinary
import { v2 as cloudinary } from "cloudinary";
// then config it in envVars
import { envVars } from "./env";

// configuring cloudinary
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const cloudinaryUpload = cloudinary;

// we will do the uploading using package

//
// Multer storage cloudinary
//our folder -> image -> form data -> File -> multer -> multer's own folder(temporary) -> Req.file ->  package(req.file) -> url -> req.file -> mongoose -> mongodb

// how does multer works

// Frontend -> form data with Image file -> Multer-> form data -> Req(Body + File)

//how does multer do it
// our folder -> image -> form data -> File -> multer -> multer's own folder -> Req.file
// Multer -> formdata -> file -> Uploads folder -> Req.File = Image

//req.file -> cloudinary(req.file) -> url -> mongoose -> stored in mongodb
