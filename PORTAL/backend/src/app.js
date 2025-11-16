import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./config/database.js";

// Rutas
import authRoutes from "./routes/auth.routes.js";
import recursoRoutes from "./routes/recursos.routes.js";
import recursoUploadRoutes from "./routes/recursoUpload.routes.js";
import busquedaRoutes from "./routes/busqueda.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import informesRoutes from "./routes/informes.routes.js";
import informeRoutes from "./routes/informe.routes.js";
import decisionRoutes from "./routes/decision.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api", recursoRoutes);
app.use("/api", recursoUploadRoutes);
app.use("/api", busquedaRoutes);
app.use("/api", menuRoutes);
app.use("/api/informes", informesRoutes);
app.use("/api/informe", informeRoutes);
app.use("/api/decisiones", decisionRoutes);

app.get("/", (req, res) => {
  res.send("Servidor backend funcionando correctamente ");
});

sequelize
  .sync()
  .then(() => console.log("Base de datos conectada y sincronizada"))
  .catch((err) =>
    console.error("Error al conectar con la base de datos:", err)
  );

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
