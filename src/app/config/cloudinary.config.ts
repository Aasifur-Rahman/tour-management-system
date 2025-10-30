// import v2 first as cloudinary
import { v2 as cloudinary } from "cloudinary";
// then config it in envVars
import { envVars } from "./env";
import AppError from "../errorHelpers/AppError";

// configuring cloudinary
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});

export const deleteImageFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

    const match = url.match(regex);

    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
      console.log(`File ${public_id} is deleted from cloudinary`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new AppError(401, "Cloudinary image deletion failed", error.message);
  }
};

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
