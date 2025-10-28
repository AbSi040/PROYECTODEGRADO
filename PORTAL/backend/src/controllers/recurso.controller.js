import { Recurso } from "../models/recurso.model.js";

export const listarRecursos = async (req, res) => {
  const recursos = await Recurso.findAll();
  res.json(recursos);
};

export const crearRecurso = async (req, res) => {
  try {
    const nuevo = await Recurso.create(req.body);
    res.json({ message: "Recurso creado correctamente", nuevo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
