// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

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
    // Reemplazar con llamada real al API
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('eco_userEmail', form.email);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="auth-page">
      <span className="leaf-deco leaf-deco-1">🌿</span>
      <span className="leaf-deco leaf-deco-2">🍃</span>

      <div className="auth-card">

        {/* Logo */}
        <div className="text-center mb-4">
          <div className="auth-logo-icon mx-auto mb-2">🌍</div>
          <h1 className="auth-logo-title">EcoMisión</h1>
          <p className="text-muted small">Inicia sesión para continuar tu misión</p>
        </div>

        {/* Bootstrap alert */}
        {error && (
          <div className="alert alert-danger py-2 px-3 rounded-3 small" role="alert">
            {error}
          </div>
        )}

        {/* Bootstrap Sign In form */}
        <form onSubmit={handleSubmit} noValidate>

          {/* form-floating — patrón oficial Bootstrap Sign In */}
          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingEmail"
              name="email"
              placeholder="nombre@ejemplo.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
            <label htmlFor="floatingEmail">✉️ Correo electrónico</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
            <label htmlFor="floatingPassword">🔒 Contraseña</label>
          </div>

          {/* Checkbox + link — patrón Bootstrap */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label small text-muted" htmlFor="rememberMe">
                Recordarme
              </label>
            </div>
            <a href="#" className="small eco-link">¿Olvidaste tu contraseña?</a>
          </div>

          {/* Botón con spinner Bootstrap */}
          <button
            className="btn btn-eco w-100 py-2"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Entrando…
              </>
            ) : (
              'Iniciar sesión 🌱'
            )}
          </button>

        </form>

        <hr className="my-3" />

        <p className="text-center small text-muted mb-0">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="eco-link fw-bold">Regístrate aquí</Link>
        </p>

      </div>
    </div>
  );
}
