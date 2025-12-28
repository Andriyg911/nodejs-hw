import { v2 as cloudinary } from "cloudinary";
import { Readable } from "node:stream";

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const saveFileToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",       // 👈 обов’язково
        folder: "avatars",            // 👈 папка для збереження
        overwrite: true,              // 👈 дозволяє перезапис
        use_filename: true,           // 👈 використовує ім’я файлу
        unique_filename: false,       // 👈 не генерує випадкове ім’я
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const readable = Readable.from(buffer);
    readable.pipe(uploadStream);
  });
};