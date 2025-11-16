import { sequelize } from "../config/database.js";

export const guardarDecision = async (req, res) => {
  const { id_usuario, id_historia, id_opcion, progreso } = req.body;

  try {
    if (!id_usuario || !id_historia || !id_opcion) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

    // 1️⃣ Buscar si hay una sesión activa
    const [sesiones] = await sequelize.query(
      `
      SELECT id_sesion 
      FROM sesion_juego
      WHERE id_usuario = ? AND id_historia = ? AND fin_en IS NULL
      ORDER BY id_sesion DESC
      LIMIT 1
      `,
      { replacements: [id_usuario, id_historia] }
    );

    let id_sesion;

    // Si no existe, creamos una nueva sesión
    if (sesiones.length === 0) {
      const [nuevaSesion] = await sequelize.query(
        `
        INSERT INTO sesion_juego (id_usuario, id_historia, progreso, inicio_en)
        VALUES (?, ?, 0, NOW());
        `,
        { replacements: [id_usuario, id_historia] }
      );

      id_sesion = nuevaSesion.insertId;
    } else {
      id_sesion = sesiones[0].id_sesion;
    }

    // 2️⃣ Insertar la decisión tomada
    await sequelize.query(
      `
      INSERT INTO decision_tomada (id_sesion, id_opcion, tomada_en)
      VALUES (?, ?, NOW());
      `,
      { replacements: [id_sesion, id_opcion] }
    );

    // 3️⃣ Actualizar progreso si viene en la petición
    if (progreso !== undefined) {
      await sequelize.query(
        `
        UPDATE sesion_juego 
        SET progreso = ?
        WHERE id_sesion = ?
        `,
        { replacements: [progreso, id_sesion] }
      );

      // 4️⃣ Si la historia llegó al 100%, cerrar sesión
      if (progreso >= 100) {
        await sequelize.query(
          `UPDATE sesion_juego 
           SET fin_en = NOW()
           WHERE id_sesion = ?`,
          { replacements: [id_sesion] }
        );
      }
    }

    return res.json({
      message: "Decisión registrada correctamente",
      id_sesion,
      progreso,
    });
  } catch (error) {
    console.error("❌ Error al guardar decisión:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
