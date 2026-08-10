// const cloudinary = require('../database/config/cloudinary');

// const uploadToCloudinary = (file, folder, resourceType = 'auto') => {
//   return new Promise((resolve, reject) => {
//     try {
//       // Support both:
//       // 1. Multer file object
//       // 2. Buffer directly
//       const buffer = Buffer.isBuffer(file) ? file : file?.buffer;

//       if (!buffer) {
//         return reject(new Error('No file buffer found for Cloudinary upload'));
//       }

//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           folder,
//           resource_type: resourceType
//         },
//         (error, result) => {
//           if (error) {
//             return reject(error);
//           }

//           resolve(result);
//         }
//       );

//       uploadStream.end(buffer);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

// module.exports = {
//   uploadToCloudinary
// };


const cloudinary = require("cloudinary").v2;

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("Cloudinary Config Check:", {
  cloud_name: cloudName ? "SET" : "MISSING",
  api_key: apiKey ? "SET" : "MISSING",
  api_secret: apiSecret ? "SET" : "MISSING",
});

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

module.exports = cloudinary;