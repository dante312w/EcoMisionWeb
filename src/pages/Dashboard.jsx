// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRetosDelDia, getRetosActivos, completarReto } from '../service/retos.api';
import { getHistorialUsuario } from '../service/history.api';
import '../styles/dashboard.css';

const DIFICULTAD_COLOR = { 'Fácil': 'success', 'Medio': 'warning', 'Difícil': 'danger' };

const CATEGORY_ICON = {
  agua:         '💧',
  energia:      '⚡',
  transporte:   '🚌',
  alimentacion: '🥗',
  residuos:     '♻️',
  hogar:        '🏠',
};

const DIFFICULTY_MAP = {
  facil:   'Fácil',
  medio:   'Medio',
  dificil: 'Difícil',
};

function mapChallenge(c) {
  return {
    _id:           c._id,
    id:            c._id,
    titulo:        c.title,
    descripcion:   c.description,
    categoria:     c.category,
    categoriaIcon: CATEGORY_ICON[c.category?.toLowerCase()] ?? '🌱',
    dificultad:    DIFFICULTY_MAP[c.difficulty?.toLowerCase()] ?? 'Fácil',
    puntos:        c.impact?.energy_kwh
                     ? Math.round(c.impact.energy_kwh * 10)
                     : 20,
    huella_kg:     c.impact?.water_liters
                     ? (c.impact.water_liters / 100).toFixed(1)
                     : 1.0,
    agua:          c.impact?.water_liters ?? 0,
    energia:       c.impact?.energy_kwh   ?? 0,
    _raw:          c,
  };
}

// ── Tarjeta de reto pendiente ─────────────────────────────────────────────────
function RetoCard({ reto, onCompletar, onSustituir, loading }) {
  const badge = DIFICULTAD_COLOR[reto.dificultad] ?? 'secondary';
  return (
    <div className="card dash-reto-card h-100">
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

        <div className="d-flex gap-2 flex-wrap">
          {reto.agua > 0 && (
            <span className="dash-huella-pill" style={{ flex: 'none' }}>
              💧 <strong>{reto.agua} L</strong>
              <span className="ms-1 text-muted" style={{ fontSize: '0.75rem' }}>agua</span>
            </span>
          )}
          {reto.energia > 0 && (
            <span className="dash-huella-pill" style={{ flex: 'none' }}>
              ⚡ <strong>{reto.energia} kWh</strong>
              <span className="ms-1 text-muted" style={{ fontSize: '0.75rem' }}>energía</span>
            </span>
          )}
        </div>

        <div className="dash-huella-pill">
          🌱 <strong>−{reto.huella_kg} kg CO₂</strong>
          <span className="ms-auto text-muted">{reto.puntos} pts</span>
        </div>

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
      </div>
    </div>
  );
}

// ── Tarjeta de reto completado ────────────────────────────────────────────────
function RetoCompletadoCard({ reto }) {
  return (
    <div className="card dash-reto-card dash-reto-card--done h-100">
      <div className="card-body d-flex flex-column gap-2">
        <div className="d-flex align-items-center justify-content-between">
          <span className="dash-cat-badge">
            {reto.categoriaIcon} {reto.categoria}
          </span>
          <span className="badge bg-success bg-opacity-15 text-success border border-success border-opacity-25">
            {reto.dificultad}
          </span>
        </div>

        <h6 className="dash-reto-title mb-0">{reto.titulo}</h6>
        <p className="dash-reto-desc mb-0">{reto.descripcion}</p>

        <div className="d-flex gap-2 flex-wrap">
          {reto.agua > 0 && (
            <span className="dash-huella-pill" style={{ flex: 'none' }}>
              💧 <strong>{reto.agua} L</strong>
              <span className="ms-1 text-muted" style={{ fontSize: '0.75rem' }}>agua</span>
            </span>
          )}
          {reto.energia > 0 && (
            <span className="dash-huella-pill" style={{ flex: 'none' }}>
              ⚡ <strong>{reto.energia} kWh</strong>
              <span className="ms-1 text-muted" style={{ fontSize: '0.75rem' }}>energía</span>
            </span>
          )}
        </div>

        <div className="dash-done-tag">✅ Completado hoy — +{reto.puntos} pts</div>
      </div>
    </div>
  );
}

// ── Dashboard principal ───────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();

  const userId    = localStorage.getItem('eco_userId');
  const email     = localStorage.getItem('eco_userEmail') ?? 'eco@usuario.com';
  const nombre    = localStorage.getItem('eco_userName')  ?? email.split('@')[0];
  const huellaKg  = parseFloat(localStorage.getItem('eco_huella') ?? '0');
  const huellaRaw = huellaKg / 1000; // Convertir kg a toneladas

let nivelMeta = {
  label: 'Huella baja 🌿',
  color: 'success',
  pct: 30,
};

if (huellaKg >= 3000 && huellaKg < 7000) {
  nivelMeta = {
    label: 'Huella media 🌤',
    color: 'warning',
    pct: 60,
  };
}

if (huellaKg >= 7000) {
  nivelMeta = {
    label: 'Huella alta 🔥',
    color: 'danger',
    pct: 90,
  };
}

  const [retosPendientes,  setRetosPendientes]  = useState([]);
  const [retosCompletados, setRetosCompletados] = useState([]);
  const [retosPool,        setRetosPool]        = useState([]);
  const [loadingId,        setLoadingId]        = useState(null);
  const [iniciando,        setIniciando]        = useState(true);
  const [error,            setError]            = useState('');
  const [puntosTotales,    setPuntosTotales]    = useState(
    parseInt(localStorage.getItem('eco_puntos') ?? '0', 10)
  );

useEffect(() => {
  if (!userId) { navigate('/login'); return; }

  const cargar = async () => {
    try {
      // ✅ PRIMER PASO: Verificar si el usuario ya respondió el quiz
      const userDataResponse = await fetch(`${import.meta.env.VITE_API_URL}/user/${userId}`);
      const userData = await userDataResponse.json();
      
      if (!userData?.user?.first_quiz_completed) {
        // Si no ha respondido el quiz, redirigir al cuestionario
        navigate('/cuestionario');
        return;
      }

      const [respuestaDiaria, activos, historial] = await Promise.all([
        // getRetosDelDia devuelve { challenge, message }
        fetch(`${import.meta.env.VITE_API_URL}/challenge/daily/${userId}`)
          .then(r => r.json()),
        getRetosActivos(),
        getHistorialUsuario(userId),
      ]);

      setRetosPool(activos.map(mapChallenge));

      const yaCompletado = respuestaDiaria.message?.toLowerCase().includes('ya completado');
      const challenge    = respuestaDiaria.challenge;

      if (!challenge) {
        setIniciando(false);
        return;
      }

      // Si el snapshot está incompleto (solo tiene icon), buscar el reto completo
      let retoCompleto = challenge;
      if (!challenge.title) {
        retoCompleto = activos.find(a => a.icon === challenge.icon) ?? challenge;
      }

      const mapped = mapChallenge(retoCompleto);

      if (yaCompletado) {
        setRetosPendientes([]);
        setRetosCompletados([mapped]);
      } else {
        setRetosPendientes([mapped]);
        setRetosCompletados([]);
      }

    } catch {
      setError('No se pudieron cargar los retos. Intenta de nuevo.');
    } finally {
      setIniciando(false);
    }
  };

  cargar();
}, [userId, navigate]);

  const handleCompletar = async (id) => {
    setLoadingId(id);
    const reto = retosPendientes.find((r) => r.id === id);
    try {
      await completarReto(userId, reto._raw);

          /* ── ACTUALIZAR HUELLA ───────────────── */
          const huellaActual = parseFloat(
            localStorage.getItem('eco_huella') ?? '0'
          );

          // usar el impacto REAL del reto
          const reduccionCO2 = parseFloat(reto.huella_kg ?? 0);

          // sumar reducción acumulada
          const nuevaHuella = huellaActual + reduccionCO2;

          localStorage.setItem(
            'eco_huella',
            nuevaHuella.toString()
          );

          /* ── PUNTOS ─────────────────────────── */
          const nuevos = puntosTotales + (reto?.puntos ?? 0);
      setPuntosTotales(nuevos);
      localStorage.setItem('eco_puntos', nuevos);
      setRetosPendientes(prev => prev.filter(r => r.id !== id));
      setRetosCompletados(prev => [...prev, reto]);
    } catch (err) {
      if (err?.message?.includes('409') || err?.status === 409) {
        setRetosPendientes(prev => prev.filter(r => r.id !== id));
        setRetosCompletados(prev => [...prev, reto]);
      } else {
        setError('No se pudo completar el reto. Intenta de nuevo.');
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleSustituir = (id) => {
    const usados = retosPendientes.map((r) => r.id);
    const pool   = retosPool.filter((r) => !usados.includes(r.id));
    if (!pool.length) return;
    const nuevo  = pool[Math.floor(Math.random() * pool.length)];
    setRetosPendientes(prev => prev.map(r => r.id === id ? nuevo : r));
  };

  const totalRetos    = retosPendientes.length + retosCompletados.length;
  const progresoRetos = totalRetos
    ? Math.round((retosCompletados.length / totalRetos) * 100)
    : 0;

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
                <span
                    className={`badge border border-${nivelMeta.color} border-opacity-25`}
                    style={{
                      backgroundColor: 'rgba(25,135,84,.12)',
                      color: '#198754',
                      fontWeight: '600',
                      padding: '0.55rem 0.9rem',
                      fontSize: '0.78rem',
                      borderRadius: '999px',
                    }}
                  >
                    {nivelMeta.label}
                  </span>
              </div>
              <h3 className="dash-huella-num">{huellaRaw.toFixed(2)} <small>ton CO₂/año</small></h3>
              <div className="progress mt-2" style={{ height: '8px' }}>
                <div
                  className={`progress-bar bg-${nivelMeta.color}`}
                  role="progressbar"
                  style={{ width: `${Math.min((huellaKg / 12000) * 100, 100)}%` }}
                  aria-valuenow={nivelMeta.pct}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
              <div className="d-flex justify-content-between mt-1">
                <small className="text-muted">0 ton</small>
                <small className="text-muted">12 ton</small>
              </div>
            </div>
          </div>
        </section>

        {/* Retos del día */}
        <section className="dash-card-section">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h6 className="dash-section-label mb-0">Retos de hoy</h6>
            <span className="dash-retos-progress-label">
              {retosCompletados.length}/{totalRetos} completados
            </span>
          </div>
          <div className="progress mb-3" style={{ height: '6px' }}>
            <div
              className="progress-bar bg-success"
              style={{ width: `${progresoRetos}%`, transition: 'width .5s ease' }}
            />
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 rounded-3 small">{error}</div>
          )}

          {iniciando ? (
            <div className="row g-3">
              {[0, 1, 2].map((i) => (
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
            <>
              {/* Pendientes */}
              {retosPendientes.length > 0 && (
                <div className="row g-3">
                  {retosPendientes.map((r, i) => (
                    <div key={r.id ?? i} className="col-12">
                      <RetoCard
                        reto={r}
                        loading={loadingId}
                        onCompletar={handleCompletar}
                        onSustituir={handleSustituir}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Completados hoy */}
              {retosCompletados.length > 0 && (
                <>
                  <h6 className="dash-section-label mt-4 mb-2">✅ Completados hoy</h6>
                  <div className="row g-3">
                    {retosCompletados.map((r, i) => (
                      <div key={r.id ?? i} className="col-12">
                        <RetoCompletadoCard reto={r} />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Todo completado */}
              {retosPendientes.length === 0 && retosCompletados.length > 0 && (
                <div className="text-center text-muted py-3">
                  <div style={{ fontSize: '2rem' }}>🎉</div>
                  <p className="small mt-1 mb-0">¡Completaste todos los retos de hoy!</p>
                  <Link to="/history" className="btn btn-eco btn-sm mt-2">Ver historial</Link>
                </div>
              )}
            </>
          )}
        </section>

        {/* Acciones rápidas */}
        

      </main>

      {/* ── Bottom nav ── */}
      <nav className="dash-bottom-nav">
        <Link to="/dashboard" className="dash-nav-item dash-nav-item--active">
          <span className="dash-nav-icon">🎯</span><span>Retos</span>
        </Link>
        <Link to="/history" className="dash-nav-item">
          <span className="dash-nav-icon">📋</span><span>Historial</span>
        </Link>
        <Link to="/plant-tree" className="dash-nav-item">
          <span className="dash-nav-icon">🌳</span><span>Árbol</span>
        </Link>
        <Link to="/profile" className="dash-nav-item">
          <span className="dash-nav-icon">👤</span><span>Perfil</span>
        </Link>
      </nav>
    </div>
  );
}