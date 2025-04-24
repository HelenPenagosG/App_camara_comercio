import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MapaPage from "./pages/MapaPage";
import PerfilPage from "./pages/PerfilPage";
import ModeloPage from "./pages/ModeloPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mapa" element={<MapaPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
        <Route path="/modelo" element={<ModeloPage />} />
      </Routes>
    </Router>
  );
}

export default App;
