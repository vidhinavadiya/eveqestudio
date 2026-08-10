const cloudinary = require('../database/config/cloudinary');

const uploadToCloudinary = (file, folder, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    try {
      // Support both:
      // 1. Multer file object
      // 2. Buffer directly
      const buffer = Buffer.isBuffer(file) ? file : file?.buffer;

      if (!buffer) {
        return reject(new Error('No file buffer found for Cloudinary upload'));
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        }
      );

      uploadStream.end(buffer);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  uploadToCloudinary
};