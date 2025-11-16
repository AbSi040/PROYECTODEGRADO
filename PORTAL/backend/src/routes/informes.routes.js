import express from "express";
import {
  crearInformeAuto,
  listarInformes,
} from "../controllers/informe.controller.js";

const router = express.Router();

/**
 * 📌 RUTA RAÍZ
 * GET /api/informes
 */
router.get("/", async (req, res) => {
  try {
    const informes = await listarInformes();
    return res.json({
      message: "Listado de informes automáticos",
      total: informes.length,
      informes,
    });
  } catch (error) {
    console.error("❌ Error al obtener informes:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

/**
 * 📌 CREAR INFORME AUTOMÁTICO
 * POST /api/informes/auto
 * (Se usa cuando Unity envía los datos del jugador)
 */
router.post("/auto", async (req, res) => {
  try {
    const informe = await crearInformeAuto(req.body);
    return res.status(201).json({
      message: "Informe creado correctamente",
      informe: informe,
    });
  } catch (error) {
    console.error("❌ Error al crear informe:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
