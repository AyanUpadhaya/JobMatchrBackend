const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { sendResponse } = require("../utils/sendResponse");
const { TEMP_DIR } = require("../utils/constants");

const initializeMulter = (app) => {
  // Multer setup for file storage
  const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "application/pdf": "pdf", // Added MIME type for PDF files
  };

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, TEMP_DIR);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir); // Store files in the specified temp directory
    },
    filename: (req, file, cb) => {
      const extension = MIME_TYPES[file.mimetype]; // Determine file extension
      cb(null, `${Date.now()}-${file.originalname}`); // Unique file naming with timestamp
    },
  });

  const upload = multer({ storage });

  // If you want to limit the number of files and their size, you can use the following:
  // app.use(upload.array("files", 10)); // 10 is the maximum number of files allowed

  // If you want to handle mixed types of fields (single and multiple files), you can use:
  // app.use(upload.fields([{ name: "singleFile", maxCount: 1 }, { name: "multipleFiles", maxCount: 10 }]));

  // If you want to handle mixed types of fields (single and multiple files), you can use:
  app.use(
    upload.fields([
      { name: "single", maxCount: 1 },
      { name: "file", maxCount: 1 },
      { name: "multiple", maxCount: 10 },
    ])
  );

  // Custom Multer error handler middleware
  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return sendResponse(res, 500, err?.message);
    } else {
      next(err);
    }
  });
};

module.exports = { initializeMulter };
