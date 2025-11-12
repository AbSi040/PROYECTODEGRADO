import express from "express";
import { guardarDecision } from "../controllers/decision.controller.js";
const router = express.Router();

router.post("/", guardarDecision);

export default router;
