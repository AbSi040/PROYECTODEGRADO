import { sequelize } from "../config/database.js";

export const guardarDecision = async (req, res) => {
  try {
    const { nombreUsuario, historia, idDecision } = req.body;

    if (!nombreUsuario || !historia || !idDecision) {
      return res
        .status(400)
        .json({ success: false, message: "Datos incompletos." });
    }

    // Buscar usuario por nombre
    const [usuario] = await sequelize.query(
      "SELECT id_usuario FROM usuario WHERE nombre = ? LIMIT 1",
      { replacements: [nombreUsuario], type: sequelize.QueryTypes.SELECT }
    );

    if (!usuario) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado." });
    }

    // Insertar decisión
    await sequelize.query(
      `INSERT INTO decision (id_usuario, historia, id_decision, fecha)
       VALUES (?, ?, ?, NOW())`,
      { replacements: [usuario.id_usuario, historia, idDecision] }
    );

    res.json({ success: true, message: "Decisión guardada correctamente." });
  } catch (error) {
    console.error("Error al guardar decisión:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno del servidor." });
  }
};
