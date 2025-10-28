import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Recurso = sequelize.define("recurso", {
  id_recurso: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING(200), allowNull: false },
  descripcion_corta: { type: DataTypes.TEXT },
  tipo: { type: DataTypes.STRING(24), allowNull: false },
  url_origen: { type: DataTypes.STRING(500), allowNull: false },
}, {
  tableName: "recurso",
  timestamps: false,
});
