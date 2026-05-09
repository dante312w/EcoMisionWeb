// src/App.jsx
// Estructura principal y rutas – EcoMisión
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Welcome  from './pages/Welcome';
import Login    from './pages/Login';
import Register from './pages/Register';
// Próximamente:
// import Cuestionario from './pages/Cuestionario';
// import Reto         from './pages/Reto';
// import Historial    from './pages/Historial';
// import Perfil       from './pages/Perfil';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pantalla de bienvenida */}
        <Route path="/"         element={<Welcome />}  />

        {/* Auth */}
        <Route path="/login"    element={<Login />}    />
        <Route path="/register" element={<Register />} />

        {/* Redirige cualquier ruta desconocida al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
