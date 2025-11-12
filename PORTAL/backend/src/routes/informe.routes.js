import express from "express";
import { crearInformeAuto, listarInformes } from "../controllers/informe.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Crear informe automático (usado por Unity al finalizar historia)
router.post("/auto", verifyToken, crearInformeAuto);

// Listar informes existentes (uso interno o de la psicóloga)
router.get("/", verifyToken, listarInformes);

export default router;
