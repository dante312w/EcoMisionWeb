// src/pages/Register.jsx
// Crear cuenta con clases Bootstrap + paleta EcoMisión
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
  const [error, setError]     = useState('');
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
    // TODO: reemplazar con llamada real a tu REST API
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('eco_userEmail', email);
      navigate('/cuestionario');
    }, 1400);
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
          <p className="text-muted small">Únete a la misión por un planeta mejor</p>
        </div>

        {/* Bootstrap alert */}
        {error && (
          <div className="alert alert-danger py-2 px-3 rounded-3 small" role="alert">
            {error}
          </div>
        )}

        {/* Bootstrap Register form */}
        <form onSubmit={handleSubmit} noValidate>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingName"
              name="name"
              placeholder="Tu nombre"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
            <label htmlFor="floatingName">👤 Nombre</label>
          </div>

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
              autoComplete="new-password"
              required
            />
            <label htmlFor="floatingPassword">🔒 Contraseña</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="floatingConfirm"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <label htmlFor="floatingConfirm">🔑 Confirmar contraseña</label>
          </div>

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
                Creando cuenta…
              </>
            ) : (
              'Registrarse 🌱'
            )}
          </button>

        </form>

        <hr className="my-3" />

        <p className="text-center small text-muted mb-0">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="eco-link fw-bold">Iniciar sesión</Link>
        </p>

      </div>
    </div>
  );
}
