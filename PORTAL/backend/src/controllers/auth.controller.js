import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/usuario.model.js";
import { Rol } from "../models/rol.model.js";

const SECRET = process.env.JWT_SECRET;

//---------REGISTRO------
export const register = async (req, res) => {
  try {
    const { login_nombre, password, id_rol, codigo_anonimo } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const nuevo = await Usuario.create({
      login_nombre,
      password_hash: hash,
      id_rol,
      codigo_anonimo
    });
    res.status(201).json({ message: "Usuario registrado", usuario: nuevo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//--------INICIO DE SESIÓN--------------
export const login = async (req, res) => {
  try {
    const { login_nombre, password } = req.body;
    const usuario = await Usuario.findOne({ where: { login_nombre }, include: Rol });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, usuario.password_hash);
    if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.Rol.codigo },
      SECRET,
      { expiresIn: "3h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      rol: usuario.Rol.nombre,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
