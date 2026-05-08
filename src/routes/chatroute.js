import express from "express";
import authMiddleWare from "../middlewares/authmiddleware.js";
import chatController from "../controllers/chatcontroller.js";
const router = express.Router();
router.post("/", authMiddleWare, chatController);
export default router;
