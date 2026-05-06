import express from "express";
import logincontroller from "../controllers/logincontroller.js";
const router = express.Router();
router.post("/", logincontroller);
export default router;
