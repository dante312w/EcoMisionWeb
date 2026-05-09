// src/pages/Register.jsx
// Pantalla de creación de cuenta – EcoMisión
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
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
    // TODO: conectar con tu backend / Firebase / Supabase
    setTimeout(() => {
      setLoading(false);
      navigate('/cuestionario'); // redirige al cuestionario inicial
    }, 1400);
  };

  return (
    <div className="auth-page">
      <span className="leaf-deco leaf-deco-1">🌿</span>
      <span className="leaf-deco leaf-deco-2">🍃</span>

      <div className="auth-card">
        {/* Mini logo */}
        <div className="auth-logo" style={{ marginBottom: '0.8rem' }}>
          <div className="auth-logo-icon" style={{ width: 60, height: 60, fontSize: '1.8rem' }}>
            🌍
          </div>
        </div>

        <h2 className="auth-heading">Crear cuenta 🌱</h2>
        <p className="auth-subheading">Únete a la misión por un planeta mejor</p>

        {error && (
          <div
            className="alert py-2 px-3 rounded-3 mb-3"
            style={{ fontSize: '0.85rem', background: '#fdecea', color: '#c0392b', border: 'none' }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="auth-input-group">
            <span className="input-icon">👤</span>
            <input
              className="auth-input"
              type="text"
              name="name"
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>

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
              autoComplete="new-password"
            />
          </div>

          {/* Confirm password */}
          <div className="auth-input-group">
            <span className="input-icon">🔑</span>
            <input
              className="auth-input"
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <button
            className="btn-eco-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? '🌱 Creando cuenta…' : 'Registrarse'}
          </button>
        </form>

        <div className="auth-footer-link">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
}
