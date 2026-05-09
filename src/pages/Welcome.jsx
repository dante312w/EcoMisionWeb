// src/pages/Welcome.jsx
// Pantalla de bienvenida – EcoMisión
import { Link } from 'react-router-dom';
import '../styles/auth.css';

export default function Welcome() {
  return (
    <div className="auth-page">
      {/* Decorative leaves */}
      <span className="leaf-deco leaf-deco-1">🌿</span>
      <span className="leaf-deco leaf-deco-2">🍃</span>

      <div className="auth-card" style={{ textAlign: 'center' }}>
        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">🌍</div>
          <h1 className="auth-logo-title">EcoMisión</h1>
          <p className="auth-logo-subtitle">Empieza tu misión por un planeta mejor</p>
        </div>

        {/* Cloud / illustration accent */}
        <div
          style={{
            fontSize: '3.5rem',
            margin: '1.2rem 0',
            opacity: 0.6,
            letterSpacing: '0.5rem',
          }}
        >
          ☁️ ☁️ ☁️
        </div>

        {/* Action buttons */}
        <div className="welcome-buttons">
          <Link to="/login" className="btn-eco-secondary">
            Iniciar sesión
          </Link>
          <Link to="/register" className="btn-eco-primary">
            Registrarse 🌱
          </Link>
        </div>
      </div>
    </div>
  );
}
