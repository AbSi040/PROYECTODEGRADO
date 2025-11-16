import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/usuario.model.js";
import { Rol } from "../models/rol.model.js";
import { v4 as uuidv4 } from "uuid";

const SECRET = process.env.JWT_SECRET;

// 📌 LOGIN UNIFICADO (Unity + Portal)
export const login = async (req, res) => {
  try {
    const { login_nombre, password } = req.body;

    const usuario = await Usuario.findOne({
      where: { login_nombre },
      include: {
        model: Rol,
        as: "Rol",
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const valid = await bcrypt.compare(password, usuario.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        rol: usuario.Rol.codigo,
      },
      SECRET,
      { expiresIn: "3h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      id_usuario: usuario.id_usuario,
      login_nombre: usuario.login_nombre,
      codigo_anonimo: usuario.codigo_anonimo,
      rol: usuario.Rol.codigo,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno en el login" });
  }
};

// 📌 REGISTRO UNIFICADO
export const register = async (req, res) => {
  try {
    const { login_nombre, password, curso, paralelo } = req.body;

    // Validación mínima
    if (!login_nombre || !password) {
      return res.status(400).json({ error: "Debe llenar todos los campos" });
    }

    // Evitar duplicados
    const existe = await Usuario.findOne({ where: { login_nombre } });
    if (existe) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    const hash = await bcrypt.hash(password, 10);

    const nuevo = await Usuario.create({
      id_rol: 1, // estudiante
      login_nombre,
      password_hash: hash,
      curso,
      paralelo,
      codigo_anonimo: uuidv4(),
    });

    res.status(201).json({
      message: "Usuario registrado correctamente",
      id_usuario: nuevo.id_usuario,
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error interno en registro" });
  }
};
