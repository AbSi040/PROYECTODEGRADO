import express from "express";
import { listarRecursos, crearRecurso } from "../controllers/recurso.controller.js";
import { verifyToken, soloPsicologa } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, listarRecursos);

router.post("/", verifyToken, soloPsicologa, crearRecurso);

export default router;
