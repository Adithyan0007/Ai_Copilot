import express from "express";
import authMiddleWare from "../middlewares/authmiddleware.js";
import searchController from "../controllers/searchcontroller.js";
const router = express.Router();
router.post("/", authMiddleWare, searchController);
export default router;
