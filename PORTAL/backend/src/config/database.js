import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME, // proyecto_videojuego_portal
  process.env.DB_USER, // root
  process.env.DB_PASSWORD, // password de Railway
  {
    host: process.env.DB_HOST, // crossover.proxy.rlwy.net
    port: process.env.DB_PORT, // 46001
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // <-- parte crítica para Railway
      },
    },
  }
);
