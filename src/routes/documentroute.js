import express from "express";
import multer from "multer";

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }

    cb(null, true);
  },
});
import {
  createDocument,
  getDocuments,
} from "../controllers/documentcontroller.js";
import authMiddleWare from "../middlewares/authmiddleware.js";
const router = express.Router();
router.get("/", authMiddleWare, getDocuments);
router.post("/", authMiddleWare, upload.single("content"), createDocument);

export default router;
