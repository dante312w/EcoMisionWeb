// src/App.jsx
// Estructura principal y rutas – EcoMisión
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Welcome      from './pages/Welcome.jsx';
import Login        from './pages/Login.jsx';
import Register     from './pages/Register.jsx';
import Cuestionario from './pages/Cuestionario.jsx';
// Próximamente:
// import Reto      from './pages/Reto.jsx';
// import Historial from './pages/Historial.jsx';
// import Perfil    from './pages/Perfil.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"             element={<Welcome />}      />
        <Route path="/login"        element={<Login />}        />
        <Route path="/register"     element={<Register />}     />
        <Route path="/cuestionario" element={<Cuestionario />} />
        {/* <Route path="/reto"      element={<Reto />}         /> */}
        <Route path="*"             element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
