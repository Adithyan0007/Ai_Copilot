import express from "express";
import {
  createDocument,
  getDocuments,
} from "../controllers/documentcontroller.js";
import authMiddleWare from "../middlewares/authmiddleware.js";
const router = express.Router();
router.get("/", authMiddleWare, getDocuments);
router.post("/", authMiddleWare, createDocument);

export default router;
