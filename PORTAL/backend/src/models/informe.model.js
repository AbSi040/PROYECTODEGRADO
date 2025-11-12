// 📁 src/models/informe.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { Usuario } from "./usuario.model.js";

/**
 * Modelo: informe
 * Representa los informes generados por el sistema o por la psicóloga.
 * Compatible con tu tabla existente definida en SCRIPTBASE.sql
 */

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
      references: { model: Usuario, key: "id_usuario" },
      onDelete: "CASCADE",
    },
    id_historia: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    generado_por: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
      comment: "ID de usuario (psicóloga o sistema) que generó el informe",
    },
    generado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    resumen: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Texto resumen del análisis (observación principal)",
    },
    json_detalle: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Datos estructurados: clúster, ratios, recomendaciones, etc.",
    },
  },
  {
    tableName: "informe",
    timestamps: false,
  }
);

// 🔗 Relaciones
Informe.belongsTo(Usuario, { foreignKey: "id_usuario", as: "estudiante" });
Informe.belongsTo(Usuario, { foreignKey: "generado_por", as: "psicologa" });
