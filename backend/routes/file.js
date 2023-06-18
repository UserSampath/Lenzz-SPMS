const express = require("express");
const router = express.Router();
const {
  uploadFile,
  find,
  deleteOne,
  downloadOne,
} = require("../util/s3Service");
const multer = require("multer");
const upload = require("../middleware/multerFileUpload");

router.post("/upload", upload.array("file"), async (req, res) => {
  try {
    const results = await uploadFile(req.files);
    // console.log(results);
    return res.json({ status: "success", results: results });
  } catch (err) {
    console.log(err);
  }
});

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "file is too large",
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "File limit reached",
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "File must be an image or pdf or zip file ",
      });
    }
  }
});

router.get("/getAll", async (req, res) => {
  try {
    const results = await find();
    return res.json(results);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/deleteOne", async (req, res) => {
  try {
    const filename = req.body.filename;
    const key = `uploads/${filename}`;
    const s = await deleteOne(key);
    res.send(s);
  } catch (err) {
    console.log(err);
  }
});

router.get("/downloadOne", async (req, res) => {
  try {
    const filename = req.body.filename;
    const key = `uploads/${filename}`;
    const r = await downloadOne(key);
    console.log(r);
    res.send(r);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
