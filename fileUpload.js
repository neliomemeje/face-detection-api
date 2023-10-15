const path = require("path");
const multer = require("multer");

const storage = (destination) =>
  multer.diskStorage({
    destination: destination,

    filename: (req, file, cb) => {
      return cb(
        null,
        `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });
const upload = (destination) =>
  multer({
    storage: storage(destination),
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .jpg, jpeg, png file format are allowed."));
      }
    },
  }).single("userImage");

module.exports = upload;
