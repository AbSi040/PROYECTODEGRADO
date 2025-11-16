import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Rol = sequelize.define(
  "rol",
  {
    id_rol: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      autoIncrement: true,
    },
    codigo: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  },
  {
    tableName: "rol",
    timestamps: false,
  }
);
