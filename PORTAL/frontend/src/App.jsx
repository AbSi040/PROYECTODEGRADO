import { Routes, Route } from "react-router-dom";
import PortalPrincipal from "./pages/PortalPrincipal.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RecursoDetalle from "./pages/RecursoDetalle.jsx";
import DenunciaViolencia from "./pages/DenunciaViolencia.jsx";
import SubirRecurso from "./pages/SubirRecurso.jsx";


function App() {
  return (
    <Routes>
      <Route path="/" element={<PortalPrincipal />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/portal/recurso/:id" element={<RecursoDetalle />} />
      <Route path="/portal/denuncia" element={<DenunciaViolencia />} />
      <Route path="/subir" element={<SubirRecurso />} />
    </Routes>
  );
}

export default App;
