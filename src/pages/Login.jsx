// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../service';
import '../styles/auth.css';

/* SVG de colinas naturales en la parte inferior */
function Hills() {
  return (
    <div className="auth-hills">
      <svg viewBox="0 0 1440 220" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
        style={{ width: '100%', display: 'block' }}>
        {/* Colina de fondo */}
        <path
          d="M0,160 C180,80 360,200 540,140 C720,80 900,200 1080,140 C1260,80 1380,160 1440,130 L1440,220 L0,220 Z"
          fill="rgba(140,195,120,0.25)"
        />
        {/* Colina media */}
        <path
          d="M0,185 C120,140 300,220 480,175 C660,130 840,210 1020,170 C1200,130 1350,185 1440,160 L1440,220 L0,220 Z"
          fill="rgba(100,170,90,0.35)"
        />
        {/* Colina frontal */}
        <path
          d="M0,200 C200,165 400,220 600,195 C800,170 1000,215 1200,195 C1350,180 1420,205 1440,200 L1440,220 L0,220 Z"
          fill="rgba(80,150,70,0.55)"
        />
      </svg>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
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
    try {
      const response = await loginUser(form.email, form.password);
      if (!response.token) throw new Error('No se recibió token de autenticación');
      localStorage.setItem('eco_token', response.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Hojas decorativas */}
      <span className="auth-leaf auth-leaf-1">🌿</span>
      <span className="auth-leaf auth-leaf-2">🍃</span>
      <span className="auth-leaf auth-leaf-3">🌿</span>
      <span className="auth-leaf auth-leaf-4">🍃</span>

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo-wrap">
          <img
            src="/icono_principal.png"
            alt="EcoMisión"
            className="auth-logo-img"
          />
          <h1 className="auth-logo-title">EcoMisión</h1>
        </div>

        <h2 className="auth-heading">Iniciar Sesión</h2>
        <p className="auth-subheading">Bienvenido de nuevo, continúa tu misión 🌱</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
          <div className="auth-field">
            <span className="auth-field-icon">✉️</span>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <span className="auth-field-icon">🔒</span>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          <button className="btn-auth-lavender" type="submit" disabled={loading}>
            {loading && <span className="btn-spinner" />}
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes cuenta?{' '}
          <Link to="/register">Crear cuenta</Link>
        </p>
      </div>

      <Hills />
    </div>
  );
}
