import express from "express";
import authMiddleWare from "../middlewares/authmiddleware.js";
import chatController from "../controllers/chatcontroller.js";
import chatHistoryController from "../controllers/chathistorycontroller.js";
const router = express.Router();
router.post("/", authMiddleWare, chatController);
router.get("/history", chatHistoryController);
export default router;
