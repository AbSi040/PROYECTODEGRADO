import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Informe = sequelize.define(
  "informe",
  {
    id_informe: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    id_historia: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    generado_por: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    generado_en: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resumen: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    json_detalle: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "informe",
    timestamps: false, // ❗ IMPORTANTE
  }
);
