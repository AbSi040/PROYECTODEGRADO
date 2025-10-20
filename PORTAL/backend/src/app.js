import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/database.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//Ruta para probar el backend desde el frontend
app.get("/api", (req, res) => {
  res.send("Servidor backend funcionando correctamente");
});

// Conexión a la base de datos
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a base de datos establecida correctamente");
    await sequelize.sync();
    console.log("Modelos sincronizados");
    app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
};

startServer();

// Puerto del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
