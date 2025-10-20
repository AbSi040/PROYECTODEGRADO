import axios from "axios";

// Instancia global de Axios
const api = axios.create({
  baseURL: "/api", // gracias al proxy de Vite, esto se dirige a http://localhost:4000
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
