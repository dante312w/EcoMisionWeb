// src/pages/Profile.jsx
// ── Versión mejorada: diseño "Que nivel vas", retos cumplidos, stats completos

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../service';
import { getHistorialUsuario } from '../service/history.api';
import '../styles/profile.css';     // ← nuevo CSS dedicado
import '../styles/dashboard.css';   // ← mantenemos para leaf-deco, nav, etc.

/* ── Niveles según puntos ──────────────────────────────────────────────────── */
const NIVELES = [
  { min: 0,    max: 99,   label: 'Semilla',      emoji: '🌱', color: '#8bc34a', next: 100  },
  { min: 100,  max: 299,  label: 'Brote',        emoji: '🌿', color: '#4caf50', next: 300  },
  { min: 300,  max: 599,  label: 'Árbol Joven',  emoji: '🌳', color: '#2e7d32', next: 600  },
  { min: 600,  max: 999,  label: 'Guardián',     emoji: '🌲', color: '#1b5e20', next: 1000 },
  { min: 1000, max: 9999, label: 'Eco Héroe',    emoji: '🦸', color: '#00695c', next: null },
];

function getNivel(puntos) {
  return NIVELES.find((n) => puntos >= n.min && puntos <= n.max) ?? NIVELES[0];
}

/* ── Sub-componente: tarjeta de estadística ────────────────────────────────── */
function StatCard({ emoji, value, label, accent }) {
  return (
    <div className="prf-stat-card" style={{ '--accent': accent }}>
      <div className="prf-stat-icon">{emoji}</div>
      <div className="prf-stat-val">{value}</div>
      <div className="prf-stat-label">{label}</div>
    </div>
  );
}

/* ── Componente principal ───────────────────────────────────────────────────── */
export default function Profile() {
  const navigate = useNavigate();

  /* ── Estado del formulario ── */
  const [form, setForm] = useState({
    name: '',
    email: '',
    objetivo: 'Reducir mi huella',
    bio: 'Quiero usar menos plástico y plantar más árboles.',
  });
  const [message,  setMessage]  = useState('');
  const [editMode, setEditMode] = useState(false);

  /* ── Métricas ── */
  const [retosCount,    setRetosCount]    = useState(0);
  const [totalAgua,     setTotalAgua]     = useState(0);
  const [totalEnergia,  setTotalEnergia]  = useState(0);
  const [cargandoHist,  setCargandoHist]  = useState(true);

  const totalArboles = parseInt(localStorage.getItem('eco_arboles') ?? '0', 10);
  const puntos       = parseInt(localStorage.getItem('eco_puntos')  ?? '0', 10);
  const huella       = parseFloat(localStorage.getItem('eco_huella') ?? '0');

  const nivel        = getNivel(puntos);
  const progPct      = nivel.next
    ? Math.round(((puntos - nivel.min) / (nivel.next - nivel.min)) * 100)
    : 100;

  /* ── Cargar datos locales ── */
  useEffect(() => {
    const email = localStorage.getItem('eco_userEmail') ?? '';
    const name  = localStorage.getItem('eco_userName')  ?? (email ? email.split('@')[0] : 'Ecoamigo');
    setForm({
      name,
      email,
      objetivo: localStorage.getItem('eco_objetivo') ?? 'Reducir mi huella',
      bio:      localStorage.getItem('eco_bio')      ?? 'Quiero usar menos plástico y plantar más árboles.',
    });
  }, []);

  /* ── Cargar historial para contar retos cumplidos ── */
  useEffect(() => {
    const userId = localStorage.getItem('eco_userId');
    if (!userId) { setCargandoHist(false); return; }

    getHistorialUsuario(userId)
      .then((data) => {
        setRetosCount(data.length);
        setTotalAgua(   data.reduce((s, h) => s + (h.impact_registered?.water_liters ?? 0), 0));
        setTotalEnergia(data.reduce((s, h) => s + (h.impact_registered?.energy_kwh    ?? 0), 0));
      })
      .catch(() => {
        // fallback: usar challenges_completed guardado en localStorage si el backend falla
        const fallback = parseInt(localStorage.getItem('eco_puntos') ?? '0', 10);
        setRetosCount(Math.floor(fallback / 20)); // 20 pts por reto
      })
      .finally(() => setCargandoHist(false));
  }, []);

  /* ── Handlers ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('eco_userEmail', form.email);
    localStorage.setItem('eco_userName',  form.name);
    localStorage.setItem('eco_objetivo',  form.objetivo);
    localStorage.setItem('eco_bio',       form.bio);
    setMessage('✅ Perfil actualizado correctamente.');
    setEditMode(false);
    setTimeout(() => setMessage(''), 3500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="dash-page prf-page">
      <span className="leaf-deco leaf-deco-1">🌿</span>
      <span className="leaf-deco leaf-deco-2">🍃</span>

      {/* ── Header ── */}
      <header className="dash-header">
        <div className="dash-header-inner container-fluid px-3">
          <div className="d-flex align-items-center gap-2">
            <Link to="/dashboard" className="dash-back-btn">←</Link>
            <span className="dash-logo-title">Mi Perfil</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="dash-pts-chip">⭐ {puntos} pts</span>
            <button onClick={handleLogout} className="prf-logout-btn">Salir</button>
          </div>
        </div>
      </header>

      <main className="dash-main container-fluid px-3">

        {/* ── Hero del perfil ── */}
        <section className="prf-hero">
          <div className="prf-avatar-wrap">
            <div className="prf-avatar">{(form.name || 'E').charAt(0).toUpperCase()}</div>
            <div className="prf-nivel-badge" style={{ background: nivel.color }}>
              {nivel.emoji} {nivel.label}
            </div>
          </div>
          <div className="prf-hero-info">
            <h2 className="prf-hero-name">{form.name || 'Ecoamigo'}</h2>
            <p  className="prf-hero-email">{form.email}</p>
            {form.objetivo && (
              <p className="prf-hero-objetivo">🎯 {form.objetivo}</p>
            )}
            {form.bio && (
              <p className="prf-hero-bio">"{form.bio}"</p>
            )}
          </div>
        </section>

        {/* ── Barra de nivel ── */}
        <section className="prf-section prf-nivel-section">
          <div className="prf-nivel-header">
            <span className="prf-nivel-titulo">
              {nivel.emoji} Nivel: <strong>{nivel.label}</strong>
            </span>
            {nivel.next && (
              <span className="prf-nivel-meta">
                {puntos} / {nivel.next} pts → {NIVELES[NIVELES.indexOf(nivel) + 1]?.label}
              </span>
            )}
            {!nivel.next && (
              <span className="prf-nivel-meta">🏆 Nivel máximo alcanzado</span>
            )}
          </div>
          <div className="prf-nivel-bar">
            <div className="prf-nivel-fill" style={{ width: `${progPct}%`, background: nivel.color }} />
          </div>
          <p className="prf-nivel-sub">
            {nivel.next
              ? `Te faltan ${nivel.next - puntos} puntos para el siguiente nivel`
              : '¡Eres un Eco Héroe!'}
          </p>
        </section>

        {/* ── Grid de stats principales ── */}
        <section className="prf-section">
          <h6 className="prf-section-title">Tu impacto</h6>
          <div className="prf-stats-grid">
            <StatCard
              emoji="🎯"
              value={cargandoHist ? '…' : retosCount}
              label="Retos cumplidos"
              accent="#4caf50"
            />
            <StatCard
              emoji="🌳"
              value={totalArboles}
              label="Árboles plantados"
              accent="#388e3c"
            />
            <StatCard
              emoji="⭐"
              value={puntos}
              label="Puntos EcoMisión"
              accent="#f9a825"
            />
            <StatCard
              emoji="🌍"
              value={`${(huella / 1000).toFixed(1)}t`}
              label="CO₂/año"
              accent="#0288d1"
            />
          </div>
        </section>

        {/* ── Stats secundarios: agua y energía ── */}
        {!cargandoHist && (totalAgua > 0 || totalEnergia > 0) && (
          <section className="prf-section">
            <h6 className="prf-section-title">Recursos ahorrados</h6>
            <div className="prf-recursos-row">
              <div className="prf-recurso-pill" style={{ '--acc': '#0288d1' }}>
                <span className="prf-recurso-icon">💧</span>
                <span className="prf-recurso-val">{totalAgua.toFixed(0)} L</span>
                <span className="prf-recurso-label">agua</span>
              </div>
              <div className="prf-recurso-pill" style={{ '--acc': '#f9a825' }}>
                <span className="prf-recurso-icon">⚡</span>
                <span className="prf-recurso-val">{totalEnergia.toFixed(1)} kWh</span>
                <span className="prf-recurso-label">energía</span>
              </div>
            </div>
          </section>
        )}

        {/* ── Mensaje de éxito ── */}
        {message && (
          <div className="prf-success-msg">{message}</div>
        )}

        {/* ── Editar perfil ── */}
        <section className="prf-section">
          <div className="prf-edit-header">
            <h6 className="prf-section-title mb-0">Editar perfil</h6>
            <button
              className="prf-edit-toggle"
              onClick={() => setEditMode((v) => !v)}
            >
              {editMode ? 'Cancelar' : '✏️ Editar'}
            </button>
          </div>

          {editMode && (
            <form onSubmit={handleSubmit} className="prf-form">
              <div className="prf-field">
                <label>Nombre</label>
                <input name="name"  value={form.name}  onChange={handleChange} required />
              </div>
              <div className="prf-field">
                <label>Correo electrónico</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="prf-field">
                <label>Objetivo ambiental</label>
                <input name="objetivo" value={form.objetivo} onChange={handleChange} />
              </div>
              <div className="prf-field">
                <label>Acerca de mí</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows="3" />
              </div>
              <button type="submit" className="prf-save-btn">
                Guardar cambios 🌱
              </button>
            </form>
          )}
        </section>

      </main>

      {/* ── Bottom nav ── */}
      <nav className="dash-bottom-nav">
        <Link to="/dashboard" className="dash-nav-item">
          <span className="dash-nav-icon">🎯</span><span>Retos</span>
        </Link>
        <Link to="/history" className="dash-nav-item">
          <span className="dash-nav-icon">📋</span><span>Historial</span>
        </Link>
        <Link to="/plant-tree" className="dash-nav-item">
          <span className="dash-nav-icon">🌳</span><span>Árbol</span>
        </Link>
        <Link to="/profile" className="dash-nav-item dash-nav-item--active">
          <span className="dash-nav-icon">👤</span><span>Perfil</span>
        </Link>
      </nav>
    </div>
  );
}
