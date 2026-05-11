// src/pages/Cuestionario.jsx
// Cuestionario de huella de carbono por pasos – EcoMisión
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { secciones, calcularHuella } from '../data/cuestionario.js';
import { guardarHuella } from '../service/api.js';
import '../styles/cuestionario.css';

export default function Cuestionario() {
  const navigate = useNavigate();

  // índice de la sección actual (0-3)
  const [seccionIdx, setSeccionIdx] = useState(0);
  // respuestas acumuladas: { pregunta_id: value }
  const [respuestas, setRespuestas] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const seccion = secciones[seccionIdx];
  const totalSecciones = secciones.length;
  const progreso = Math.round(((seccionIdx) / totalSecciones) * 100);

  // ── Verificar si todas las preguntas de la sección están respondidas ───────
  const seccionCompleta = seccion.preguntas.every((p) => respuestas[p.id]);

  // ── Manejar selección de respuesta ────────────────────────────────────────
  const handleRespuesta = (preguntaId, valor) => {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: valor }));
  };

  // ── Siguiente sección ──────────────────────────────────────────────────────
  const handleSiguiente = () => {
    if (!seccionCompleta) return;
    if (seccionIdx < totalSecciones - 1) {
      setSeccionIdx((i) => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ── Anterior sección ───────────────────────────────────────────────────────
  const handleAnterior = () => {
    if (seccionIdx > 0) {
      setSeccionIdx((i) => i - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ── Enviar al backend y navegar a Retos ───────────────────────────────────
  const handleEnviar = async () => {
    if (!seccionCompleta) return;
    setEnviando(true);
    setError('');

    try {
      const huellaKg = calcularHuella(respuestas);
      const userId = localStorage.getItem('eco_userId') || 'guest';

      // Guarda en backend (TODO: asegúrate que el endpoint esté activo)
      await guardarHuella(userId, respuestas, huellaKg);

      // Guarda localmente como respaldo
      localStorage.setItem('eco_huella', huellaKg);

      navigate('/reto');
    } catch (err) {
      console.error(err);
      // Si el backend falla, guarda local y sigue de todas formas
      const huellaKg = calcularHuella(respuestas);
      localStorage.setItem('eco_huella', huellaKg);
      navigate('/reto');
    } finally {
      setEnviando(false);
    }
  };

  const esUltimaSeccion = seccionIdx === totalSecciones - 1;

  return (
    <div className="cuest-page">
      {/* ── Decoración ─────────────────────────────────── */}
      <span className="leaf-deco leaf-deco-1">🌿</span>
      <span className="leaf-deco leaf-deco-2">🍃</span>

      <div className="cuest-card">
        {/* ── Header ─────────────────────────────────────── */}
        <div className="cuest-header">
          <div className="cuest-emoji">{seccion.emoji}</div>
          <div>
            <h1 className="cuest-title">
              {seccionIdx === 0 && seccion.titulo === 'Transporte'
                ? '🌱 Cuestionario Inicial'
                : seccion.titulo}
            </h1>
            <p className="cuest-subtitle">{seccion.descripcion}</p>
          </div>
        </div>

        {/* ── Barra de progreso ──────────────────────────── */}
        <div className="cuest-progress-wrap">
          <div className="cuest-progress-labels">
            {secciones.map((s, i) => (
              <span
                key={s.id}
                className={`cuest-step-dot ${i < seccionIdx ? 'done' : ''} ${i === seccionIdx ? 'active' : ''}`}
                title={s.titulo}
              >
                {i < seccionIdx ? '✓' : s.emoji}
              </span>
            ))}
          </div>
          <div className="cuest-progress-bar">
            <div
              className="cuest-progress-fill"
              style={{ width: `${((seccionIdx + 1) / totalSecciones) * 100}%` }}
            />
          </div>
          <p className="cuest-progress-text">
            Sección {seccionIdx + 1} de {totalSecciones} — {seccion.titulo}
          </p>
        </div>

        {/* ── Preguntas ──────────────────────────────────── */}
        <div className="cuest-preguntas" key={seccion.id}>
          {seccion.preguntas.map((pregunta, pIdx) => (
            <div className="cuest-pregunta" key={pregunta.id}>
              <p className="cuest-pregunta-texto">
                <span className="cuest-pregunta-num">{pIdx + 1}.</span>{' '}
                {pregunta.texto}
              </p>
              <div className="cuest-opciones">
                {pregunta.opciones.map((opcion) => {
                  const seleccionada = respuestas[pregunta.id] === opcion.value;
                  return (
                    <button
                      key={opcion.value}
                      className={`cuest-opcion ${seleccionada ? 'seleccionada' : ''}`}
                      onClick={() => handleRespuesta(pregunta.id, opcion.value)}
                      type="button"
                    >
                      <span className="cuest-radio">
                        {seleccionada ? '🟢' : '⚪'}
                      </span>
                      <span>{opcion.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Error ──────────────────────────────────────── */}
        {error && (
          <p className="cuest-error">{error}</p>
        )}

        {/* ── Navegación ─────────────────────────────────── */}
        <div className="cuest-nav">
          {seccionIdx > 0 && (
            <button className="btn-cuest-back" onClick={handleAnterior} type="button">
              ← Anterior
            </button>
          )}

          {!esUltimaSeccion ? (
            <button
              className={`btn-cuest-next ${!seccionCompleta ? 'disabled' : ''}`}
              onClick={handleSiguiente}
              disabled={!seccionCompleta}
              type="button"
            >
              Siguiente →
            </button>
          ) : (
            <button
              className={`btn-cuest-finish ${!seccionCompleta ? 'disabled' : ''}`}
              onClick={handleEnviar}
              disabled={!seccionCompleta || enviando}
              type="button"
            >
              {enviando ? '🌍 Calculando…' : 'Comenzar mi aventura 🌱'}
            </button>
          )}
        </div>

        {/* Aviso si la sección no está completa */}
        {!seccionCompleta && (
          <p className="cuest-aviso">Responde todas las preguntas para continuar</p>
        )}
      </div>
    </div>
  );
}
