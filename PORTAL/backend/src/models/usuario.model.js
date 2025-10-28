import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Rol } from "./rol.model.js";

export const Usuario = sequelize.define("usuario", {
  id_usuario: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  id_rol: { type: DataTypes.SMALLINT, allowNull: false },
  login_nombre: { type: DataTypes.STRING(80), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  nombre_completo: { type: DataTypes.STRING(120) },
  codigo_anonimo: { type: DataTypes.STRING(32), allowNull: false },
}, {
  tableName: "usuario",
  timestamps: false,
});

Usuario.belongsTo(Rol, { foreignKey: "id_rol" });
