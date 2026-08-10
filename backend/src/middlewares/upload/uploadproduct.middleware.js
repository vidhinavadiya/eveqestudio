const multer = require("multer");
const path = require("path");

// Store files in memory instead of local disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",

    "video/mp4",
    "video/webm",
    "video/quicktime",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP images and MP4, WEBM, MOV videos are allowed"
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,

  limits: {
    // 100 MB maximum per file
    fileSize: 100 * 1024 * 1024,
  },
});

module.exports = upload;