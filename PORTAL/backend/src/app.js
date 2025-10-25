import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/database.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Ruta para probar el backend desde el frontend
app.get("/api", (req, res) => {
  res.send("✅ Servidor backend funcionando correctamente");
});

// Conexión a la base de datos
sequelize.sync()
  .then(() => console.log("✅ Base de datos conectada y sincronizada"))
  .catch((err) => console.error("❌ Error al conectar con la base de datos:", err));

// Puerto del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
