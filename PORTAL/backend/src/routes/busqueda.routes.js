import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/buscar", async (req, res) => {
  try {
    const { consulta } = req.body;
    const response = await axios.post("http://localhost:5000/buscar", { consulta });
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error al conectar con TF-IDF:", err.message);
    res.status(500).json({ error: "Error en el servicio de búsqueda semántica." });
  }
});

export default router;
