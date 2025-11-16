import express from "express";
import { sequelize } from "../config/database.js"; // ✅ Importación correcta
const router = express.Router();

router.get("/tipos-violencia", async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      "SELECT * FROM tipo_violencia ORDER BY nombre"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener tipos de violencia:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.get("/categorias", async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      "SELECT * FROM categoria ORDER BY nombre"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.get("/menu", async (req, res) => {
  try {
    const [categorias] = await sequelize.query(
      "SELECT * FROM categoria ORDER BY nombre"
    );

    const [tipos] = await sequelize.query(
      "SELECT * FROM tipo_violencia ORDER BY nombre"
    );

    res.json({
      categorias,
      tipos_violencia: tipos,
    });
  } catch (error) {
    console.error("Error al obtener menú:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

export default router;
