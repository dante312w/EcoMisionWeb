import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

export default function Profile() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    objetivo: 'Reducir mi huella',
    bio: 'Quiero usar menos plástico y plantar más árboles.',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('eco_userEmail') ?? '';
    const name = localStorage.getItem('eco_userName') ?? (email ? email.split('@')[0] : 'Ecoamigo');
    const objetivo = localStorage.getItem('eco_objetivo') ?? 'Reducir mi huella';
    const bio = localStorage.getItem('eco_bio') ?? 'Quiero usar menos plástico y plantar más árboles.';
    setForm({ name, email, objetivo, bio });
  }, []);

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

  const totalArboles = parseInt(localStorage.getItem('eco_arboles') ?? '0', 10);
  const puntos = parseInt(localStorage.getItem('eco_puntos') ?? '0', 10);
  const huella = parseFloat(localStorage.getItem('eco_huella') ?? '0');

  return (
    <div className="dash-page">
      <span className="leaf-deco leaf-deco-1">🌿</span>
      <span className="leaf-deco leaf-deco-2">🍃</span>

      <header className="dash-header">
        <div className="dash-header-inner container-fluid px-3">
          <div className="d-flex align-items-center gap-2">
            <Link to="/dashboard" className="dash-back-btn">←</Link>
            <span className="dash-logo-icon">👤</span>
            <span className="dash-logo-title">Mi Perfil</span>
          </div>
          <span className="dash-pts-chip">{puntos} pts</span>
        </div>
      </header>

      <main className="dash-main container-fluid px-3">
        <section className="dash-welcome mb-3">
          <p className="dash-welcome-sub">Perfil activo</p>
          <h2 className="dash-welcome-name">{form.name || 'Ecoamigo'}</h2>
          <p className="text-muted small mb-0">Administra tu cuenta y tus objetivos de sostenibilidad.</p>
        </section>

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

        <section className="dash-card-section">
          <div className="card dash-reto-card">
            <div className="card-body">
              <h6 className="dash-section-label mb-3">Editar perfil</h6>
              {message && (
                <div className="alert alert-success py-2 px-3 rounded-3 small" role="alert">
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre</label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo electrónico</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="objetivo" className="form-label">Objetivo ambiental</label>
                  <input
                    id="objetivo"
                    name="objetivo"
                    value={form.objetivo}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="bio" className="form-label">Acerca de mí</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                  />
                </div>
                <button type="submit" className="btn btn-eco w-100 py-2">Guardar cambios</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <nav className="dash-bottom-nav">
        <Link to="/dashboard" className="dash-nav-item">
          <span className="dash-nav-icon">🎯</span>
          <span>Retos</span>
        </Link>
        <Link to="/plant-tree" className="dash-nav-item">
          <span className="dash-nav-icon">🌳</span>
          <span>Árbol</span>
        </Link>
        <Link to="/profile" className="dash-nav-item dash-nav-item--active">
          <span className="dash-nav-icon">👤</span>
          <span>Perfil</span>
        </Link>
      </nav>
    </div>
  );
}
