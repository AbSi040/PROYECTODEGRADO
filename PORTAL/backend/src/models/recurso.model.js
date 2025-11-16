import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Recurso = sequelize.define(
  "recurso",
  {
    id_recurso: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descripcion_corta: {
      type: DataTypes.STRING(500),
    },
    tipo: {
      type: DataTypes.STRING(50), // PDF, IMAGE, VIDEO, INFOGRAFIA, etc.
      allowNull: false,
    },
    url_origen: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    autor_fuente: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    archivo: {
      type: DataTypes.BLOB("long"), // Muy importante
      allowNull: true,
    },
  },
  {
    tableName: "recurso",
    timestamps: true,
    createdAt: "creado_en",
    updatedAt: "actualizado_en",
  }
);
