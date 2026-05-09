// src/pages/Login.jsx
// Pantalla de inicio de sesión – EcoMisión
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    // TODO: conectar con tu backend / Firebase / Supabase
    setTimeout(() => {
      setLoading(false);
      navigate('/reto'); // redirige a la pantalla principal
    }, 1200);
  };

  return (
    <div className="auth-page">
      <span className="leaf-deco leaf-deco-1">🌿</span>
      <span className="leaf-deco leaf-deco-2">🍃</span>

      <div className="auth-card">
        {/* Mini logo */}
        <div className="auth-logo" style={{ marginBottom: '1rem' }}>
          <div className="auth-logo-icon" style={{ width: 60, height: 60, fontSize: '1.8rem' }}>
            🌍
          </div>
          <h1 className="auth-logo-title" style={{ fontSize: '1.6rem' }}>EcoMisión</h1>
        </div>

        <h2 className="auth-heading">Bienvenido de vuelta 👋</h2>
        <p className="auth-subheading">Inicia sesión para continuar tu misión</p>

        {error && (
          <div
            className="alert alert-danger py-2 px-3 rounded-3 mb-3"
            style={{ fontSize: '0.85rem', background: '#fdecea', color: '#c0392b', border: 'none' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="auth-input-group">
            <span className="input-icon">✉️</span>
            <input
              className="auth-input"
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div className="auth-input-group">
            <span className="input-icon">🔒</span>
            <input
              className="auth-input"
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          {/* Forgot password */}
          <div style={{ textAlign: 'right', marginBottom: '0.3rem' }}>
            <a
              href="#"
              style={{ fontSize: '0.82rem', color: 'var(--eco-green)', textDecoration: 'none', fontWeight: 600 }}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            className="btn-eco-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? '🌱 Entrando…' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="auth-footer-link">
          ¿No tienes cuenta?{' '}
          <Link to="/register">Regístrate aquí</Link>
        </div>
      </div>
    </div>
  );
}
