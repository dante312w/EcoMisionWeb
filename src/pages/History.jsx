// src/pages/History.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHistorialUsuario } from '../service/history.api';

const CATEGORY_ICON = {
  agua:         '💧',
  energia:      '⚡',
  transporte:   '🚌',
  alimentacion: '🥗',
  residuos:     '♻️',
  hogar:        '🏠',
};

function formatFecha(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function History() {
  const userId = localStorage.getItem('eco_userId');

  const [historial,  setHistorial]  = useState([]);
  const [cargando,   setCargando]   = useState(true);
  const [error,      setError]      = useState('');

  useEffect(() => {
    if (!userId) return;
    const cargar = async () => {
      try {
        const data = await getHistorialUsuario(userId);
        // Más reciente primero
        const ordenado = [...data].sort(
          (a, b) => new Date(b.completed_at) - new Date(a.completed_at)
        );
        setHistorial(ordenado);
      } catch {
        setError('No se pudo cargar el historial.');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [userId]);

  // Totales acumulados
  const totalAgua    = historial.reduce((s, h) => s + (h.impact_registered?.water_liters ?? 0), 0);
  const totalEnergia = historial.reduce((s, h) => s + (h.impact_registered?.energy_kwh    ?? 0), 0);
  const totalRetos   = historial.length;

  return (
    <div className="dash-page">
      <span className="leaf-deco leaf-deco-1">🌿</span>
      <span className="leaf-deco leaf-deco-2">🍃</span>

      {/* Header */}
      <header className="dash-header">
        <div className="dash-header-inner container-fluid px-3">
          <div className="d-flex align-items-center gap-2">
            <span className="dash-logo-icon">🌍</span>
            <span className="dash-logo-title">EcoMisión</span>
          </div>
          <span className="dash-pts-chip">📋 Historial</span>
        </div>
      </header>

      <main className="dash-main container-fluid px-3">

        {/* Resumen de impacto */}
        <section className="dash-card-section">
          <h6 className="dash-section-label mb-3">Tu impacto acumulado</h6>
          <div className="row g-2">
            <div className="col-4">
              <div className="card text-center py-3">
                <div style={{ fontSize: '1.6rem' }}>🎯</div>
                <div className="fw-bold" style={{ fontSize: '1.2rem' }}>{totalRetos}</div>
                <small className="text-muted">Retos</small>
              </div>
            </div>
            <div className="col-4">
              <div className="card text-center py-3">
                <div style={{ fontSize: '1.6rem' }}>💧</div>
                <div className="fw-bold" style={{ fontSize: '1.2rem' }}>{totalAgua.toFixed(0)} L</div>
                <small className="text-muted">Agua</small>
              </div>
            </div>
            <div className="col-4">
              <div className="card text-center py-3">
                <div style={{ fontSize: '1.6rem' }}>⚡</div>
                <div className="fw-bold" style={{ fontSize: '1.2rem' }}>{totalEnergia.toFixed(1)} kWh</div>
                <small className="text-muted">Energía</small>
              </div>
            </div>
          </div>
        </section>

        {/* Lista de historial */}
        <section className="dash-card-section pb-4">
          <h6 className="dash-section-label mb-3">Retos completados</h6>

          {error && (
            <div className="alert alert-danger py-2 px-3 rounded-3 small">{error}</div>
          )}

          {cargando ? (
            <div className="row g-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="col-12">
                  <div className="card dash-skeleton">
                    <div className="card-body">
                      <div className="sk-line sk-badge mb-2" />
                      <div className="sk-line sk-title mb-2" />
                      <div className="sk-line sk-short" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : historial.length === 0 ? (
            <div className="text-center text-muted py-5">
              <div style={{ fontSize: '2.5rem' }}>🌱</div>
              <p className="mt-2">Aún no has completado ningún reto.<br />¡Empieza hoy!</p>
              <Link to="/dashboard" className="btn btn-eco btn-sm mt-1">Ver retos</Link>
            </div>
          ) : (
            <div className="row g-3">
              {historial.map((h, i) => {
                const snap = h.challenge_snapshot ?? {};
                const icon = CATEGORY_ICON[snap.category?.toLowerCase()] ?? '🌱';
                return (
                  <div key={h._id ?? i} className="col-12">
                    <div className="card dash-reto-card dash-reto-card--done">
                      <div className="card-body d-flex flex-column gap-2">

                        {/* Cabecera */}
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="dash-cat-badge">
                            {icon} {snap.category ?? '—'}
                          </span>
                          <small className="text-muted">{formatFecha(h.completed_at)}</small>
                        </div>

                        {/* Título */}
                        <h6 className="dash-reto-title mb-0">
                          {snap.title ?? 'Reto completado'}
                        </h6>

                        {/* Impacto */}
                        <div className="d-flex gap-2 flex-wrap mt-1">
                          {h.impact_registered?.water_liters > 0 && (
                            <span className="dash-huella-pill" style={{ flex: 'none' }}>
                              💧 <strong>{h.impact_registered.water_liters} L</strong>
                              <span className="ms-1 text-muted" style={{ fontSize: '0.75rem' }}>agua</span>
                            </span>
                          )}
                          {h.impact_registered?.energy_kwh > 0 && (
                            <span className="dash-huella-pill" style={{ flex: 'none' }}>
                              ⚡ <strong>{h.impact_registered.energy_kwh} kWh</strong>
                              <span className="ms-1 text-muted" style={{ fontSize: '0.75rem' }}>energía</span>
                            </span>
                          )}
                        </div>

                        <div className="dash-done-tag">✅ Completado</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      {/* Bottom nav */}
      <nav className="dash-bottom-nav">
        <Link to="/dashboard" className="dash-nav-item">
          <span className="dash-nav-icon">🎯</span><span>Retos</span>
        </Link>
        <Link to="/history" className="dash-nav-item dash-nav-item--active">
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