import express from "express";
import { guardarDecision } from "../controllers/decision.controller.js";
const router = express.Router();

router.post("/guardar", guardarDecision);

export default router;
