import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PortalPrincipal from "./pages/PortalPrincipal.jsx";
import RecursoDetalle from "./pages/RecursoDetalle.jsx";
import DenunciaViolencia from "./pages/DenunciaViolencia.jsx";

function App() {
  return (
    <>
      <nav style={{ padding: "10px", background: "#eee" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Inicio</Link>
        <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
        <Link to="/portal">Portal</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/portal" element={<PortalPrincipal />} />
        <Route path="/portal/recurso/:id" element={<RecursoDetalle />} />
        <Route path="/portal/denuncia" element={<DenunciaViolencia />} />
      </Routes>
    </>
  );
}

export default App;
