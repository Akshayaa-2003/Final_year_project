import express from "express";
import { predictCrowd } from "../controllers/predictController.js";

const router = express.Router();
router.post("/", predictCrowd);

export default router;
