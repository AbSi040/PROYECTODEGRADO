import express from "express";
import bcrypt from "bcrypt";
import { Usuario } from "../models/usuario.model.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// INICIO DE SESIÓN
router.post("/login", async (req, res) => {
  try {
    const { nombre, contrasena } = req.body;

    const usuario = await Usuario.findOne({ where: { login_nombre: nombre } });

    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado. Por favor, regístrese." });
    }

    const validPassword = await bcrypt.compare(contrasena, usuario.password_hash);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Contraseña incorrecta." });
    }

    return res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      id_usuario: usuario.id_usuario,
      nombre: usuario.login_nombre,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

// REGISTRO
router.post("/register", async (req, res) => {
  try {
    const { nombre, contrasena, curso, paralelo } = req.body;

    if (!nombre || !contrasena) {
      return res.status(400).json({ success: false, message: "Debe llenar todos los campos." });
    }

    // Verificar si el usuario ya existe
    const existe = await Usuario.findOne({ where: { login_nombre: nombre } });
    if (existe) {
      return res.status(400).json({ success: false, message: "El usuario ya existe." });
    }


    const hashedPassword = await bcrypt.hash(contrasena, 10);


    const nuevo = await Usuario.create({
      id_rol: 1, 
      login_nombre: nombre,
      password_hash: hashedPassword,
      curso,
      paralelo,
      codigo_anonimo: uuidv4(),
    });

    return res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      id_usuario: nuevo.id_usuario,
    });

  } catch (error) {
    console.error("Error en registro:", error);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

export default router;
