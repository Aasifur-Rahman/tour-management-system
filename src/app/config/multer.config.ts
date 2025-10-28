import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    // WHAT IS PUBLIC ID here?
    // we will get public id in this second parameter for
    // that we will need unique id
    //The identifier that's used for accessing and delivering the uploaded asset. If not specified, then the public ID of the asset will either be comprised of random characters or will use the original file's filename, depending whether use_filename is set to true.
    // so we wll give him a unique public id by ourself
    public_id: (req, file) => {
      // My Image.png convert -> 4532ssfs-545454-my-image.png (unique name)
      const fileName = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-") // removing empty string and replacing them with dash
        .replace(/\./g, "-")
        // eslint-disable-next-line no-useless-escape
        .replace(/[^a-z0-9\-\.]/g, ""); // non alpha numeric - !@#$

      const extension = file.originalname.split(".").pop();

      const uniqueFileName =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        fileName +
        "." +
        extension;

      return uniqueFileName;
    },
  },
});

export const multerUpload = multer({
  storage: storage,
});
