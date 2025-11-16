import { Routes, Route } from "react-router-dom";
import PortalPrincipal from "./pages/PortalPrincipal.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RecursoDetalle from "./pages/RecursoDetalle.jsx";
import DenunciaViolencia from "./pages/DenunciaViolencia.jsx";
import SubirRecurso from "./pages/SubirRecurso.jsx";
import PanelPsicologa from "./pages/PanelPsicologa.jsx";
import InformeDetalle from "./pages/InformeDetalle.jsx";
import TestDashboard from "./pages/testDashboard.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PortalPrincipal />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/portal/recurso/:id" element={<RecursoDetalle />} />
      <Route path="/portal/denuncia" element={<DenunciaViolencia />} />
      <Route path="/subir" element={<SubirRecurso />} />
      <Route path="/panel/psicologa" element={<PanelPsicologa />} />
      <Route
        path="/panel/psicologa/estudiante/:id"
        element={<InformeDetalle />}
      />
      <Route path="/test-dashboard" element={<TestDashboard />} />
    </Routes>
  );
}

export default App;
