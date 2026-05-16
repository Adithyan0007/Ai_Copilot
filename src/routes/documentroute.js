import express from "express";
import multer from "multer";

const upload = multer({
  dest: "uploads/",
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
