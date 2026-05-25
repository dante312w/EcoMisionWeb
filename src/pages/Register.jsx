// src/pages/Register.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../service';
import '../styles/auth.css';

function Hills() {
  return (
    <div className="auth-hills">
      <svg viewBox="0 0 1440 220" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
        style={{ width: '100%', display: 'block' }}>
        <path
          d="M0,160 C180,80 360,200 540,140 C720,80 900,200 1080,140 C1260,80 1380,160 1440,130 L1440,220 L0,220 Z"
          fill="rgba(140,195,120,0.25)"
        />
        <path
          d="M0,185 C120,140 300,220 480,175 C660,130 840,210 1020,170 C1200,130 1350,185 1440,160 L1440,220 L0,220 Z"
          fill="rgba(100,170,90,0.35)"
        />
        <path
          d="M0,200 C200,165 400,220 600,195 C800,170 1000,215 1200,195 C1350,180 1420,205 1440,200 L1440,220 L0,220 Z"
          fill="rgba(80,150,70,0.55)"
        />
      </svg>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { name, email, password, confirmPassword } = form;

    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
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

        <h2 className="auth-heading">Crear cuenta</h2>
        <p className="auth-subheading">Únete a la misión por un planeta mejor 🌍</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
          <div className="auth-field">
            <span className="auth-field-icon">👤</span>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

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
              autoComplete="new-password"
              required
            />
          </div>

          <div className="auth-field">
            <span className="auth-field-icon">🔑</span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <button className="btn-auth-primary" type="submit" disabled={loading}>
            {loading && <span className="btn-spinner" />}
            {loading ? 'Creando cuenta…' : 'Registrarse'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>

      <Hills />
    </div>
  );
}
