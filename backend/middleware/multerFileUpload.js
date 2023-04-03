
const multer = require("multer");
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    req.body.fileType = file.mimetype;
    if (file.mimetype.split("/")[0] === "image" || file.mimetype === "application/pdf" || file.mimetype === "application/zip" ||file.mimetype === "application/x-zip-compressed" ) {
        req.middleware = file.mimetype;
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100000000, files: 10 },
});

module.exports = upload;