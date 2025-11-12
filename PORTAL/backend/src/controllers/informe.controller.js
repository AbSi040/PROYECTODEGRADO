// 📁 src/controllers/informe.controller.js
import { sequelize } from "../config/database.js";
import { Informe } from "../models/informe.model.js";
import { Usuario } from "../models/usuario.model.js";

/**
 * 🔹 Función auxiliar: Genera una observación y recomendación automática
 *    en base a los ratios proactivo/pasivo/agresivo.
 */
const generarObservacion = (ratios) => {
  const { ratio_proactivo, ratio_pasivo, ratio_agresivo } = ratios;

  let cluster = "Inseguro";
  let observacion = "";
  let recomendacion = "";

  // 🔸 Clasificación heurística (temporal hasta usar K-Means)
  if (ratio_proactivo >= 0.5) {
    cluster = "Reflexivo";
    observacion =
      "Toma decisiones empáticas, reflexiona antes de actuar y busca resolver los conflictos de manera pacífica.";
    recomendacion =
      "Reforzar su participación como modelo positivo de reflexión y diálogo en el aula.";
  } else if (ratio_pasivo >= 0.4) {
    cluster = "Inseguro";
    observacion =
      "Tiende a evitar el conflicto o buscar aprobación externa ante situaciones de presión.";
    recomendacion =
      "Promover actividades que fortalezcan la autoconfianza y la toma de decisiones asertiva.";
  } else if (ratio_agresivo >= 0.3) {
    cluster = "En riesgo";
    observacion =
      "Demuestra respuestas impulsivas o normaliza conductas de control y violencia.";
    recomendacion =
      "Requiere acompañamiento para fortalecer la gestión emocional y comprensión de límites personales.";
  }

  return { cluster, observacion, recomendacion };
};

/**
 * 🧠 Función: crearInformeAuto
 * Crea o actualiza un informe en base a los datos del estudiante al terminar una sesión de juego.
 */
export const crearInformeAuto = async (req, res) => {
  const { id_usuario, id_historia, ratio_proactivo, ratio_pasivo, ratio_agresivo } = req.body;

  if (!id_usuario || id_historia === undefined) {
    return res.status(400).json({ error: "Faltan parámetros obligatorios." });
  }

  try {
    // Verificar si el usuario existe
    const estudiante = await Usuario.findByPk(id_usuario);
    if (!estudiante) {
      return res.status(404).json({ error: "Estudiante no encontrado." });
    }

    // Generar observación y recomendación automáticas
    const analisis = generarObservacion({ ratio_proactivo, ratio_pasivo, ratio_agresivo });

    // Armar el JSON de detalle
    const json_detalle = {
      cluster: analisis.cluster,
      ratio_proactivo,
      ratio_pasivo,
      ratio_agresivo,
      recomendacion: analisis.recomendacion,
    };

    // Verificar si ya existe un informe previo para este usuario e historia
    const [informeExistente] = await sequelize.query(
      `
      SELECT id_informe FROM informe
      WHERE id_usuario = ? AND id_historia = ?
      ORDER BY generado_en DESC LIMIT 1;
      `,
      { replacements: [id_usuario, id_historia] }
    );

    if (informeExistente.length > 0) {
      // Actualizar informe existente
      await Informe.update(
        {
          resumen: analisis.observacion,
          json_detalle,
          generado_en: new Date(),
        },
        { where: { id_informe: informeExistente[0].id_informe } }
      );
      return res.json({ message: "Informe actualizado correctamente.", analisis });
    } else {
      // Crear nuevo informe
      await Informe.create({
        id_usuario,
        id_historia,
        generado_por: null, // generado por el sistema
        resumen: analisis.observacion,
        json_detalle,
      });
      return res.json({ message: "Informe generado correctamente.", analisis });
    }
  } catch (error) {
    console.error("Error al generar informe automático:", error);
    res.status(500).json({ error: "Error al generar informe automático." });
  }
};

/**
 * 📄 Obtener todos los informes existentes (para depuración o pruebas)
 */
export const listarInformes = async (req, res) => {
  try {
    const [rows] = await sequelize.query(`
      SELECT 
        i.id_informe,
        u.login_nombre AS estudiante,
        i.resumen,
        i.json_detalle,
        i.generado_en
      FROM informe i
      JOIN usuario u ON u.id_usuario = i.id_usuario
      ORDER BY i.generado_en DESC;
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al listar informes:", error);
    res.status(500).json({ error: "Error al listar informes." });
  }
};
