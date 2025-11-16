import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Usuario = sequelize.define(
  "usuario",
  {
    id_usuario: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    id_rol: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
    },
    login_nombre: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    curso: {
      type: DataTypes.STRING(20),
    },
    paralelo: {
      type: DataTypes.STRING(5),
    },
    codigo_anonimo: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "usuario",
    timestamps: true,
    createdAt: "creado_en",
    updatedAt: "actualizado_en",
  }
);
