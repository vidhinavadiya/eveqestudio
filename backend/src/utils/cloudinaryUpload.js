
const cloudinary = require("../database/config/cloudinary");

/**
 * Upload file to Cloudinary
 *
 * Supports:
 * 1. Multer file object
 * 2. Buffer directly
 *
 * @param {Object|Buffer} file
 * @param {String} folder
 * @param {String} resourceType
 * @returns {Promise<Object>}
 */
const uploadToCloudinary = (
  file,
  folder,
  resourceType = "auto"
) => {
  return new Promise((resolve, reject) => {
    try {
      // Support both Multer file object and Buffer
      const buffer = Buffer.isBuffer(file)
        ? file
        : file?.buffer;

      if (!buffer) {
        return reject(
          new Error("No file buffer found for Cloudinary upload")
        );
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) {
            console.error(
              "Cloudinary Upload Error:",
              error
            );

            return reject(error);
          }

          resolve(result);
        }
      );

      uploadStream.end(buffer);
    } catch (error) {
      console.error(
        "Cloudinary Upload Exception:",
        error
      );

      reject(error);
    }
  });
};

module.exports = {
  uploadToCloudinary,
};

