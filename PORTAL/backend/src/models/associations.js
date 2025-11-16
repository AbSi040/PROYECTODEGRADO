import { Usuario } from "./usuario.model.js";
import { Rol } from "./rol.model.js";

// Usuario pertenece a Rol
Usuario.belongsTo(Rol, {
  foreignKey: "id_rol",
  as: "Rol",
});

// Rol tiene muchos Usuarios
Rol.hasMany(Usuario, {
  foreignKey: "id_rol",
  as: "Usuarios",
});

export { Usuario, Rol };
