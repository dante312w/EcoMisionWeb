// src/pages/Profile.jsx

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../service';
import '../styles/dashboard.css';

export default function Profile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    objetivo: 'Reducir mi huella',
    bio: 'Quiero usar menos plástico y plantar más árboles.',
  });

  const [message, setMessage] = useState('');

  /* ───── Cargar datos locales del perfil ───── */
  useEffect(() => {
    const email = localStorage.getItem('eco_userEmail') ?? '';
    const name =
      localStorage.getItem('eco_userName') ??
      (email ? email.split('@')[0] : 'Ecoamigo');

    const objetivo =
      localStorage.getItem('eco_objetivo') ?? 'Reducir mi huella';

    const bio =
      localStorage.getItem('eco_bio') ??
      'Quiero usar menos plástico y plantar más árboles.';

    setForm({ name, email, objetivo, bio });
  }, []);

  /* ───── Handlers ───── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem('eco_userEmail', form.email);
    localStorage.setItem('eco_userName', form.name);
    localStorage.setItem('eco_objetivo', form.objetivo);
    localStorage.setItem('eco_bio', form.bio);

    setMessage('Perfil actualizado correctamente.');
    setTimeout(() => setMessage(''), 3000);
  };

  /* ───── Cerrar sesión ───── */
  const handleLogout = () => {
    logout();           // ✅ elimina eco_token
    navigate('/login'); // ✅ redirige
  };

  /* ───── Métricas locales ───── */
  const totalArboles = parseInt(
    localStorage.getItem('eco_arboles') ?? '0',
    10
  );
  const puntos = parseInt(
    localStorage.getItem('eco_puntos') ?? '0',
    10
  );
  const huella = parseFloat(
    localStorage.getItem('eco_huella') ?? '0'
  );

  /* ───── Render ───── */
  return (
    <div className="dash-page">
      <span className="leaf-deco leaf-deco-1">🌿</span>
      <span className="leaf-deco leaf-deco-2">🍃</span>

      {/* Header */}
      <header className="dash-header">
        <div className="dash-header-inner container-fluid px-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <Link to="/dashboard" className="dash-back-btn">←</Link>
            <span className="dash-logo-icon">👤</span>
            <span className="dash-logo-title">Mi Perfil</span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="dash-pts-chip">{puntos} pts</span>
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-outline-danger"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="dash-main container-fluid px-3">
        <section className="dash-welcome mb-3">
          <p className="dash-welcome-sub">Perfil activo</p>
          <h2 className="dash-welcome-name">
            {form.name || 'Ecoamigo'}
          </h2>
          <p className="text-muted small mb-0">
            Administra tu cuenta y tus objetivos de sostenibilidad.
          </p>
        </section>

        {/* Resumen */}
        <section className="dash-card-section">
          <div className="card dash-reto-card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="dash-section-label">Resumen</span>
                <span className="badge bg-success bg-opacity-15 text-success border border-success border-opacity-25">
                  Activo
                </span>
              </div>

              <div className="row g-3 text-center">
                <div className="col-4">
                  <p className="pt-stat-val">{totalArboles}</p>
                  <p className="pt-stat-label">Árboles plantados</p>
                </div>
                <div className="col-4">
                  <p className="pt-stat-val">{puntos}</p>
                  <p className="pt-stat-label">Puntos</p>
                </div>
                <div className="col-4">
                  <p className="pt-stat-val">{huella}</p>
                  <p className="pt-stat-label">Ton CO₂/año</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Editar perfil */}
        <section className="dash-card-section">
          <div className="card dash-reto-card">
            <div className="card-body">
              <h6 className="dash-section-label mb-3">Editar perfil</h6>

              {message && (
                <div className="alert alert-success py-2 px-3 rounded-3 small">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Objetivo ambiental</label>
                  <input
                    name="objetivo"
                    value={form.objetivo}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Acerca de mí</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-eco w-100 py-2"
                >
                  Guardar cambios
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom nav */}
      <nav className="dash-bottom-nav">
        <Link to="/dashboard" className="dash-nav-item">
          <span className="dash-nav-icon">🎯</span>
          <span>Retos</span>
        </Link>
        <Link to="/plant-tree" className="dash-nav-item">
          <span className="dash-nav-icon">🌳</span>
          <span>Árbol</span>
        </Link>
        <Link
          to="/profile"
          className="dash-nav-item dash-nav-item--active"
        >
          <span className="dash-nav-icon">👤</span>
          <span>Perfil</span>
        </Link>
      </nav>
    </div>
  );
}