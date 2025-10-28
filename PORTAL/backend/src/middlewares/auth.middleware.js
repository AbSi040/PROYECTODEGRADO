import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header) return res.status(403).json({ error: "Token requerido" });

  const token = header.split(" ")[1];
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token inválido" });
    req.user = decoded;
    next();
  });
};

export const soloPsicologa = (req, res, next) => {
  if (req.user.rol !== "PSYCHOLOGIST")
    return res.status(403).json({ error: "Acceso restringido" });
  next();
};
