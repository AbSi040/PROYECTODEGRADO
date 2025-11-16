import express from "express";
import { sequelize } from "../config/database.js";

const router = express.Router();

/**
 * 📌 ENDPOINT PRINCIPAL DEL MENÚ
 * Devuelve:
 * - todas las categorías
 * - todos los tipos de violencia
 */
router.get("/menu", async (req, res) => {
  try {
    const [categorias] = await sequelize.query(
      "SELECT * FROM categoria ORDER BY nombre"
    );

    const [tipos] = await sequelize.query(
      "SELECT * FROM tipo_violencia ORDER BY nombre"
    );

    return res.json({
      categorias,
      tipos_violencia: tipos,
    });
  } catch (error) {
    console.error("❌ Error al obtener menú:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

/**
 * 📌 Obtener todas las categorías (independiente)
 */
router.get("/categorias", async (req, res) => {
  try {
    const [categorias] = await sequelize.query(
      "SELECT * FROM categoria ORDER BY nombre"
    );
    return res.json(categorias);
  } catch (error) {
    console.error("❌ Error al obtener categorías:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

/**
 * 📌 Obtener todos los tipos de violencia (independiente)
 */
router.get("/tipos-violencia", async (req, res) => {
  try {
    const [tipos] = await sequelize.query(
      "SELECT * FROM tipo_violencia ORDER BY nombre"
    );
    return res.json(tipos);
  } catch (error) {
    console.error("❌ Error al obtener tipos de violencia:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
