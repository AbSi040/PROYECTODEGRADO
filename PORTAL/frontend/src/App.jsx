import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

function App() {
  return (
    <>
      <nav style={{ display: "flex", gap: "10px", padding: "10px", background: "#eee" }}>
  <Link to="/">Inicio</Link>
  <Link to="/login">Iniciar sesión</Link>
</nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
