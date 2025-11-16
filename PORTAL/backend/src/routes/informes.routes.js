// 📁 src/routes/informes.routes.js
import express from "express";
import { sequelize } from "../config/database.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    endpoints: [
      "/api/informes/distribucion",
      "/api/informes/progreso",
      "/api/informes/decisiones",
      "/api/informes/comparativa",
      "/api/informes/estudiantes",
      "/api/informes/estudiantes/:id",
      "/api/informes/estudiantes/:id/progreso",
      "/api/informes/alertas",
    ],
  });
});

/* ============================================================================
   🟩 1️⃣ DISTRIBUCIÓN DE ESTUDIANTES POR CLÚSTER
============================================================================ */
router.get("/distribucion", async (req, res) => {
  try {
    const [rows] = await sequelize.query(`
      SELECT 
        JSON_UNQUOTE(JSON_EXTRACT(i.json_detalle, '$.cluster')) AS cluster,
        COUNT(*) AS cantidad
      FROM informe i
      WHERE JSON_EXTRACT(i.json_detalle, '$.cluster') IS NOT NULL
      GROUP BY cluster;
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener distribución:", error);
    res
      .status(500)
      .json({ error: "Error al obtener la distribución de clústeres." });
  }
});

/* ============================================================================
   🟦 2️⃣ PROGRESO PROMEDIO POR HISTORIA
============================================================================ */
router.get("/progreso", async (req, res) => {
  try {
    const [rows] = await sequelize.query(`
      SELECT 
        h.titulo AS historia,
        COUNT(sj.id_sesion) AS sesiones,
        ROUND(AVG(COALESCE(sj.progreso,0)),2) AS promedio
      FROM historia h
      LEFT JOIN sesion_juego sj ON sj.id_historia = h.id_historia
      GROUP BY h.titulo;
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener progreso:", error);
    res.status(500).json({ error: "Error al obtener el progreso promedio." });
  }
});

/* ============================================================================
   🟨 3️⃣ MAPA DE CALOR DE DECISIONES (base para futuras gráficas)
============================================================================ */
router.get("/decisiones", async (req, res) => {
  try {
    const [rows] = await sequelize.query(`
      SELECT 
        onodo.clase_norm AS tipo,
        COUNT(dt.id_decision) AS total
      FROM decision_tomada dt
      JOIN opcion_nodo onodo ON onodo.id_opcion = dt.id_opcion
      GROUP BY onodo.clase_norm;
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener decisiones:", error);
    res.status(500).json({ error: "Error al obtener el mapa de decisiones." });
  }
});

/* ============================================================================
   🟧 4️⃣ COMPARATIVAS POR CURSO O TIPO DE VIOLENCIA
============================================================================ */
router.get("/comparativa", async (req, res) => {
  try {
    const filtro = req.query.filtro || "curso";

    let sql = "";
    if (filtro === "curso") {
      sql = `
        SELECT 
          u.curso,
          COUNT(i.id_informe) AS total_estudiantes,
          ROUND(AVG(JSON_EXTRACT(i.json_detalle, '$.ratio_proactivo') * 100),2) AS prom_reflexivo,
          ROUND(AVG(JSON_EXTRACT(i.json_detalle, '$.ratio_pasivo') * 100),2) AS prom_inseguro,
          ROUND(AVG(JSON_EXTRACT(i.json_detalle, '$.ratio_agresivo') * 100),2) AS prom_riesgo
        FROM informe i
        JOIN usuario u ON u.id_usuario = i.id_usuario
        GROUP BY u.curso;
      `;
    } else if (filtro === "tipo_violencia") {
      sql = `
        SELECT 
          tv.nombre AS tipo_violencia,
          COUNT(i.id_informe) AS total_estudiantes,
          ROUND(AVG(JSON_EXTRACT(i.json_detalle, '$.ratio_proactivo') * 100),2) AS prom_reflexivo,
          ROUND(AVG(JSON_EXTRACT(i.json_detalle, '$.ratio_pasivo') * 100),2) AS prom_inseguro,
          ROUND(AVG(JSON_EXTRACT(i.json_detalle, '$.ratio_agresivo') * 100),2) AS prom_riesgo
        FROM informe i
        JOIN usuario u ON u.id_usuario = i.id_usuario
        JOIN historia h ON h.id_historia = i.id_historia
        JOIN tipo_violencia tv ON tv.id_tipo = h.id_tipo
        GROUP BY tv.nombre;
      `;
    }

    const [rows] = await sequelize.query(sql);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener comparativa:", error);
    res.status(500).json({ error: "Error al obtener la comparativa." });
  }
});

/* ============================================================================
   🟦 5️⃣ LISTADO GENERAL DE ESTUDIANTES (con progreso)
============================================================================ */
router.get("/estudiantes", async (req, res) => {
  //router.get("/estudiantes", verifyToken, soloPsicologa, async (req, res) => {
  try {
    const [rows] = await sequelize.query(`
      SELECT 
        u.id_usuario,
        u.login_nombre AS nombre,
        u.curso,
        u.paralelo,
        COALESCE(ROUND(AVG(sj.progreso),2), 0) AS progreso,
        JSON_UNQUOTE(JSON_EXTRACT(i.json_detalle, '$.cluster')) AS cluster,
        i.resumen AS observacion
      FROM usuario u
      LEFT JOIN informe i ON u.id_usuario = i.id_usuario
      LEFT JOIN sesion_juego sj ON sj.id_usuario = u.id_usuario
      WHERE u.id_rol = 1
      GROUP BY u.id_usuario, u.login_nombre, u.curso, u.paralelo, i.json_detalle, i.resumen
      ORDER BY u.curso, u.paralelo, u.login_nombre;
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al listar estudiantes:", error);
    res.status(500).json({ error: "Error al listar estudiantes." });
  }
});

/* ============================================================================
   🟪 6️⃣ DETALLE INDIVIDUAL DE ESTUDIANTE (con progreso actual)
============================================================================ */
router.get("/estudiantes/:id", async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      `
      SELECT 
        u.login_nombre AS nombre,
        u.curso,
        u.paralelo,
        COALESCE(ROUND(AVG(sj.progreso),2), 0) AS progreso,
        i.resumen AS observacion,
        JSON_UNQUOTE(JSON_EXTRACT(i.json_detalle, '$.cluster')) AS cluster,
        JSON_UNQUOTE(JSON_EXTRACT(i.json_detalle, '$.recomendacion')) AS recomendacion,
        MAX(i.generado_en) AS generado_en
      FROM usuario u
      LEFT JOIN informe i ON u.id_usuario = i.id_usuario
      LEFT JOIN sesion_juego sj ON sj.id_usuario = u.id_usuario
      WHERE u.id_usuario = ?
      GROUP BY u.login_nombre, u.curso, u.paralelo, i.resumen, i.json_detalle;
    `,
      { replacements: [req.params.id] }
    );

    if (!rows.length)
      return res.status(404).json({ error: "Estudiante no encontrado." });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener detalle:", error);
    res.status(500).json({ error: "Error al obtener detalle del estudiante." });
  }
});

/* ============================================================================
   🟣 7️⃣ PROGRESO POR HISTORIA (detalle de las 3 historias)
============================================================================ */
router.get("/estudiantes/:id/progreso", async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      `
      SELECT 
        h.titulo AS historia,
        COALESCE(sj.progreso, 0) AS progreso,
        sj.actualizado_en
      FROM historia h
      LEFT JOIN sesion_juego sj 
        ON sj.id_historia = h.id_historia AND sj.id_usuario = ?
      ORDER BY h.id_historia;
    `,
      { replacements: [req.params.id] }
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener progreso por historia:", error);
    res.status(500).json({ error: "Error al obtener progreso por historia." });
  }
});

/* ============================================================================
   🟫 8️⃣ ALERTAS AUTOMÁTICAS (ratios)
============================================================================ */
router.get("/alertas", async (req, res) => {
  try {
    const [rows] = await sequelize.query(`
      SELECT 
        u.id_usuario,
        u.login_nombre AS nombre,
        JSON_EXTRACT(i.json_detalle, '$.ratio_pasivo') AS ratio_pasivo,
        JSON_EXTRACT(i.json_detalle, '$.ratio_agresivo') AS ratio_agresivo
      FROM informe i
      JOIN usuario u ON u.id_usuario = i.id_usuario
      WHERE (JSON_EXTRACT(i.json_detalle, '$.ratio_pasivo') >= 0.5)
         OR (JSON_EXTRACT(i.json_detalle, '$.ratio_agresivo') >= 0.4);
    `);

    const alertas = rows.map((r) => ({
      id_usuario: r.id_usuario,
      nombre: r.nombre,
      tipo_alerta:
        r.ratio_agresivo >= 0.4
          ? "Conductas agresivas recurrentes"
          : "Tendencia a sumisión o evasión de conflicto",
      nivel: r.ratio_agresivo >= 0.4 ? "Rojo" : "Amarillo",
    }));

    res.json(alertas);
  } catch (error) {
    console.error("Error al obtener alertas:", error);
    res.status(500).json({ error: "Error al obtener alertas automáticas." });
  }
});

/* ============================================================================
   🟧 9️⃣ EXPORTACIÓN DE INFORMES (pendiente)
============================================================================ */
router.get("/exportar/:formato", async (req, res) => {
  try {
    const { formato } = req.params;
    const [data] = await sequelize.query("SELECT * FROM informe;");

    if (formato === "excel") {
      return res.json({ message: "Exportación Excel en construcción.", data });
    } else if (formato === "pdf") {
      return res.json({ message: "Exportación PDF en construcción.", data });
    } else {
      return res.status(400).json({ error: "Formato no soportado." });
    }
  } catch (error) {
    console.error("Error al exportar informe:", error);
    res.status(500).json({ error: "Error al exportar informe." });
  }
});

export default router;
