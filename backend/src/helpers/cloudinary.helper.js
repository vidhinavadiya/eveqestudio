const cloudinary = require("../database/config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (file, folder = "products") => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error("Invalid file buffer"));
    }

    const isVideo = file.mimetype.startsWith("video/");

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: isVideo ? "video" : "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
          width: result.width || null,
          height: result.height || null,
          bytes: result.bytes || null,
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return null;

  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};