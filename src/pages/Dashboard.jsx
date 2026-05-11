// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

// ── Mock retos (reemplazar con llamada a api.js) ──────────────────────────────
const MOCK_RETOS = [
  {
    id: 1, titulo: 'Viaje sin auto',
    descripcion: 'Usa transporte público, bicicleta o camina todo el día.',
    categoria: 'Transporte', categoriaIcon: '🚌',
    dificultad: 'Fácil', puntos: 20, huella_kg: 1.8,
  },
  {
    id: 2, titulo: 'Plato 100 % vegetal',
    descripcion: 'Prepara o pide una comida completamente vegetal hoy.',
    categoria: 'Alimentación', categoriaIcon: '🥗',
    dificultad: 'Medio', puntos: 35, huella_kg: 2.5,
  },
  {
    id: 3, titulo: 'Ducha de 5 minutos',
    descripcion: 'Limita tu ducha a 5 minutos usando un temporizador.',
    categoria: 'Hogar', categoriaIcon: '🚿',
    dificultad: 'Fácil', puntos: 15, huella_kg: 0.9,
  },
  {
    id: 4, titulo: 'Cero plástico desechable',
    descripcion: 'Evita bolsas, pajillas y empaques de plástico todo el día.',
    categoria: 'Residuos', categoriaIcon: '♻️',
    dificultad: 'Difícil', puntos: 50, huella_kg: 3.2,
  },
  {
    id: 5, titulo: 'Desconexión energética',
    descripcion: 'Desconecta de la corriente aparatos en desuso por 2 horas.',
    categoria: 'Energía', categoriaIcon: '⚡',
    dificultad: 'Medio', puntos: 25, huella_kg: 1.4,
  },
];

const DIFICULTAD_COLOR = { 'Fácil': 'success', 'Medio': 'warning', 'Difícil': 'danger' };

function pickRandom(list, excludeIds = []) {
  const pool = list.filter((r) => !excludeIds.includes(r.id));
  return pool[Math.floor(Math.random() * pool.length)] ?? list[0];
}

// ── Componente tarjeta de reto ────────────────────────────────────────────────
function RetoCard({ reto, onCompletar, onSustituir, completado, loading }) {
  const badge = DIFICULTAD_COLOR[reto.dificultad] ?? 'secondary';
  return (
    <div className={`card dash-reto-card h-100 ${completado ? 'dash-reto-card--done' : ''}`}>
      <div className="card-body d-flex flex-column gap-2">
        <div className="d-flex align-items-center justify-content-between">
          <span className="dash-cat-badge">
            {reto.categoriaIcon} {reto.categoria}
          </span>
          <span className={`badge bg-${badge} bg-opacity-15 text-${badge} border border-${badge} border-opacity-25`}>
            {reto.dificultad}
          </span>
        </div>

        <h6 className="dash-reto-title mb-0">{reto.titulo}</h6>
        <p className="dash-reto-desc mb-0">{reto.descripcion}</p>

        <div className="dash-huella-pill">
          🌱 <strong>−{reto.huella_kg} kg CO₂</strong>
          <span className="ms-auto text-muted">{reto.puntos} pts</span>
        </div>

        {completado ? (
          <div className="dash-done-tag">✅ Completado</div>
        ) : (
          <div className="d-flex gap-2 mt-auto">
            <button
              className="btn btn-eco btn-sm flex-fill"
              onClick={() => onCompletar(reto.id)}
              disabled={loading === reto.id}
            >
              {loading === reto.id
                ? <span className="spinner-border spinner-border-sm" />
                : '✅ Completar'}
            </button>
            <button
              className="btn dash-btn-swap btn-sm"
              onClick={() => onSustituir(reto.id)}
              disabled={loading === reto.id}
              title="Sustituir reto"
            >🔄</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Dashboard principal ───────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();

  const email    = localStorage.getItem('eco_userEmail') ?? 'eco@usuario.com';
  const nombre   = localStorage.getItem('eco_userName')  ?? email.split('@')[0];
  const huellaRaw = parseFloat(localStorage.getItem('eco_huella') ?? '0');

  // Nivel de huella: bajo < 5, medio < 12, alto >= 12 (toneladas CO₂/año)
  const nivelHuella = huellaRaw < 5 ? 'bajo' : huellaRaw < 12 ? 'medio' : 'alto';
  const nivelMeta = {
    bajo:  { label: 'Huella baja 🌿',   color: 'success', pct: 30 },
    medio: { label: 'Huella media 🌤',   color: 'warning', pct: 60 },
    alto:  { label: 'Huella alta 🔥',    color: 'danger',  pct: 90 },
  }[nivelHuella];

  const [retos,       setRetos]       = useState([]);
  const [completados, setCompletados] = useState(new Set());
  const [loadingId,   setLoadingId]   = useState(null);
  const [iniciando,   setIniciando]   = useState(true);
  const [puntosTotales, setPuntosTotales] = useState(
    parseInt(localStorage.getItem('eco_puntos') ?? '0', 10)
  );

  // Simula fetch de retos
  useEffect(() => {
    const timer = setTimeout(() => {
      // Elige 3 retos aleatorios
      const shuffled = [...MOCK_RETOS].sort(() => Math.random() - .5).slice(0, 3);
      setRetos(shuffled);
      setIniciando(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCompletar = async (id) => {
    setLoadingId(id);
    // TODO: await api.completarReto(id)
    await new Promise((r) => setTimeout(r, 1000));
    const reto = retos.find((r) => r.id === id);
    const nuevos = puntosTotales + (reto?.puntos ?? 0);
    setPuntosTotales(nuevos);
    localStorage.setItem('eco_puntos', nuevos);
    setCompletados((prev) => new Set([...prev, id]));
    setLoadingId(null);
  };

  const handleSustituir = (id) => {
    const usados = retos.map((r) => r.id);
    const nuevo  = pickRandom(MOCK_RETOS, usados);
    setRetos((prev) => prev.map((r) => (r.id === id ? nuevo : r)));
    setCompletados((prev) => { const s = new Set(prev); s.delete(id); return s; });
  };

  const retosCompletados = completados.size;
  const progresoRetos    = retos.length ? Math.round((retosCompletados / retos.length) * 100) : 0;

  return (
    <div className="dash-page">
      <span className="leaf-deco leaf-deco-1">🌿</span>
      <span className="leaf-deco leaf-deco-2">🍃</span>

      {/* ── Header ── */}
      <header className="dash-header">
        <div className="dash-header-inner container-fluid px-3">
          <div className="d-flex align-items-center gap-2">
            <span className="dash-logo-icon">🌍</span>
            <span className="dash-logo-title">EcoMisión</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="dash-pts-chip">⭐ {puntosTotales} pts</span>
            <Link to="/profile" className="dash-avatar" title="Mi perfil">
              {nombre.charAt(0).toUpperCase()}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Contenido ── */}
      <main className="dash-main container-fluid px-3">

        {/* Bienvenida */}
        <section className="dash-welcome">
          <p className="dash-welcome-sub mb-0">¡Hola de nuevo,</p>
          <h2 className="dash-welcome-name">{nombre} 👋</h2>
          <p className="text-muted small mb-0">Sigue construyendo un planeta mejor, un reto a la vez.</p>
        </section>

        {/* Resumen de huella */}
        <section className="dash-card-section">
          <div className="card dash-huella-summary">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="dash-section-label">Tu huella de carbono</span>
                <span className={`badge bg-${nivelMeta.color} bg-opacity-15 text-${nivelMeta.color} border border-${nivelMeta.color} border-opacity-25`}>
                  {nivelMeta.label}
                </span>
              </div>
              <h3 className="dash-huella-num">{huellaRaw} <small>ton CO₂/año</small></h3>
              <div className="progress mt-2" style={{ height: '8px' }}>
                <div
                  className={`progress-bar bg-${nivelMeta.color}`}
                  role="progressbar"
                  style={{ width: `${nivelMeta.pct}%` }}
                  aria-valuenow={nivelMeta.pct}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
              <div className="d-flex justify-content-between mt-1">
                <small className="text-muted">0 ton</small>
                <small className="text-muted">20 ton</small>
              </div>
            </div>
          </div>
        </section>

        {/* Progreso de retos del día */}
        <section className="dash-card-section">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h6 className="dash-section-label mb-0">Retos de hoy</h6>
            <span className="dash-retos-progress-label">
              {retosCompletados}/{retos.length} completados
            </span>
          </div>
          <div className="progress mb-3" style={{ height: '6px' }}>
            <div
              className="progress-bar bg-success"
              style={{ width: `${progresoRetos}%`, transition: 'width .5s ease' }}
            />
          </div>

          {iniciando ? (
            <div className="row g-3">
              {[0,1,2].map((i) => (
                <div key={i} className="col-12">
                  <div className="card dash-skeleton">
                    <div className="card-body">
                      <div className="sk-line sk-badge mb-2" />
                      <div className="sk-line sk-title mb-2" />
                      <div className="sk-line mb-1" />
                      <div className="sk-line sk-short mb-3" />
                      <div className="sk-line sk-pill" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row g-3">
              {retos.map((r) => (
                <div key={r.id} className="col-12">
                  <RetoCard
                    reto={r}
                    completado={completados.has(r.id)}
                    loading={loadingId}
                    onCompletar={handleCompletar}
                    onSustituir={handleSustituir}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Acciones rápidas */}
        <section className="dash-card-section pb-4">
          <h6 className="dash-section-label mb-3">Acciones rápidas</h6>
          <div className="row g-2">
            <div className="col-6">
              <Link to="/plant-tree" className="dash-action-card">
                <span className="dash-action-icon">🌳</span>
                <span className="dash-action-label">Plantar árbol</span>
              </Link>
            </div>
            <div className="col-6">
              <Link to="/profile" className="dash-action-card">
                <span className="dash-action-icon">👤</span>
                <span className="dash-action-label">Mi perfil</span>
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── Bottom nav ── */}
      <nav className="dash-bottom-nav">
        <Link to="/dashboard"  className="dash-nav-item dash-nav-item--active">
          <span className="dash-nav-icon">🎯</span><span>Retos</span>
        </Link>
        <Link to="/plant-tree" className="dash-nav-item">
          <span className="dash-nav-icon">🌳</span><span>Árbol</span>
        </Link>
        <Link to="/profile"    className="dash-nav-item">
          <span className="dash-nav-icon">👤</span><span>Perfil</span>
        </Link>
      </nav>
    </div>
  );
}
