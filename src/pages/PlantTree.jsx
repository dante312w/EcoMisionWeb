// src/pages/PlantTree.jsx
// ── Versión con llamada real a la API (plantarArbol) + guardado lat/lng
import { request } from '../service/api.js';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';
import TreeMapLeaflet from '../components/TreeMapLeaflet';


const ARBOLES = [
  { id: 'roble',    nombre: 'Roble',    icon: '🌳', co2_anual: 21, tiempo: '5-10 años', descripcion: 'Árbol longevo que absorbe hasta 21 kg de CO₂/año en su madurez.' },
  { id: 'pino',     nombre: 'Pino',     icon: '🌲', co2_anual: 11, tiempo: '3-5 años',  descripcion: 'Crece rápido y es ideal para reforestación en zonas altas.' },
  { id: 'mango',    nombre: 'Mango',    icon: '🥭', co2_anual: 8,  tiempo: '2-4 años',  descripcion: 'Árbol frutal tropical que combina producción de alimentos y captura de CO₂.' },
  { id: 'bambú',    nombre: 'Bambú',    icon: '🎋', co2_anual: 35, tiempo: '1-2 años',  descripcion: 'El bambú captura CO₂ 25 veces más rápido que cualquier árbol.' },
  { id: 'aguacate', nombre: 'Aguacate', icon: '🫒', co2_anual: 6,  tiempo: '3-6 años',  descripcion: 'Frutal popular en Colombia que también contribuye a la captura de carbono.' },
];

const CANTIDADES = [1, 3, 5, 10, 20];

export default function PlantTree() {
  const [selArbol,       setSelArbol]       = useState(ARBOLES[0]);
  const [cantidad,       setCantidad]       = useState(1);
  const [plantando,      setPlantando]      = useState(false);
  const [resultado,      setResultado]      = useState(null);
  const [plantError,     setPlantError]     = useState('');
  const [plantados,      setPlantados]      = useState(
    parseInt(localStorage.getItem('eco_arboles') ?? '0', 10)
  );

  // Ubicación
  const [locationQuery,    setLocationQuery]    = useState('');
  const [selectedLocation, setSelectedLocation] = useState(
    JSON.parse(localStorage.getItem('eco_plant_location') || 'null')
  );
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError,   setLocationError]   = useState('');

  const handleGeolocate = () => {
  if (!navigator.geolocation) {
    setPlantError('Tu navegador no soporta geolocalización');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const location = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        address: 'Ubicación actual',
      };

      setSelectedLocation(location);
      localStorage.setItem('eco_plant_location', JSON.stringify(location));
    },
    (err) => {
      console.error(err);
      setPlantError('Permiso denegado o error de ubicación');
    }
  );
};




  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const defaultLocation = selectedLocation || {
    lat: 2.43823,
    lng: -76.61316,
    address: 'Popayán, Colombia',
  };

  const impactoTotal  = selArbol.co2_anual * cantidad;
  const impacto10años = impactoTotal * 10;

  /* ── Geocodificación ────────────────────────────────────────────────────── */
  const handleBuscarUbicacion = async () => {
    if (!locationQuery.trim()) {
      setLocationError('Ingresa una dirección o ciudad.');
      return;
    }
    if (!GOOGLE_MAPS_API_KEY) {
      setLocationError('No hay clave de Google Maps configurada.');
      return;
    }

    setLocationLoading(true);
    setLocationError('');

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        locationQuery
      )}&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      const data     = await response.json();

      if (data.status !== 'OK' || !data.results?.length) {
        throw new Error('No se encontró la ubicación.');
      }

      const result = data.results[0];
      const { lat, lng } = result.geometry.location;
      const location = { address: result.formatted_address, lat, lng };
      setSelectedLocation(location);
      localStorage.setItem('eco_plant_location', JSON.stringify(location));
    } catch (err) {
      setLocationError(err.message || 'Error al buscar la ubicación.');
    } finally {
      setLocationLoading(false);
    }
  };

  /* ── Plantar (usar request directo a /history) ────────────────────────── */
  const handlePlantar = async () => {
    const userId = localStorage.getItem('eco_userId');
    const username = localStorage.getItem('eco_username') || 'Usuario';
    if (!userId) {
      setPlantError('No se encontró tu sesión.');
      return;
    }

    setPlantando(true);
    setPlantError('');

    const locationToSend = selectedLocation || defaultLocation;

    try {
      await request('/tree', {
        method: 'POST',
        body: {
          user_id: userId,
          username: username,
          tree_type: selArbol.nombre,

          planted_at: new Date(),

          location: {
            type: "Point",
            coordinates: [
              locationToSend.lng,
              locationToSend.lat
            ]
          },

          visible_on_map: true
        }
      });

      const nuevos = plantados + cantidad;
      setPlantados(nuevos);
      localStorage.setItem('eco_arboles', nuevos);
      setResultado({ arbol: selArbol, cantidad, co2: impactoTotal, location: locationToSend });
      } catch (err) {
      console.error('❌ ERROR COMPLETO:', err);

      if (err.response) {
        console.error('❌ STATUS:', err.response.status);
        console.error('❌ DATA BACKEND:', err.response.data);
      } else {
        console.error('❌ ERROR SIN RESPONSE:', err);
      }

      setPlantError(
        err.response?.data?.message || 
        err.message || 
        'Error al guardar en el servidor'
      );

    } finally {
      setPlantando(false);
    }
  };


  const handleNuevo = () => {
    setResultado(null);
    setPlantError('');
  };

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="dash-page">
      <span className="leaf-deco leaf-deco-1">🌿</span>
      <span className="leaf-deco leaf-deco-2">🍃</span>

      {/* Header */}
      <header className="dash-header">
        <div className="dash-header-inner container-fluid px-3">
          <div className="d-flex align-items-center gap-2">
            <Link to="/dashboard" className="dash-back-btn">←</Link>
            <span className="dash-logo-icon">🌳</span>
            <span className="dash-logo-title">Plantar Árbol</span>
          </div>
          <span className="dash-pts-chip">🌳 {plantados} árboles</span>
        </div>
      </header>

      <main className="dash-main container-fluid px-3">

        {/* Hero */}
        <section className="pt-tree-hero">
          <p className="pt-tree-tagline">Cada árbol que plantas<br />es una promesa al futuro 🌏</p>
        </section>

        {resultado ? (
          /* ── Pantalla de éxito ── */
          <section className="dash-card-section">
            <div className="card dash-huella-summary text-center pt-4 pb-3">
              <div className="pt-success-icon mb-2">🌱</div>
              <h4 className="fw-800 text-success">¡Plantados!</h4>
              <p className="text-muted small mb-3">
                Has plantado <strong>{resultado.cantidad} {resultado.arbol.nombre}{resultado.cantidad > 1 ? 's' : ''}</strong> con éxito.
              </p>
              <div className="dash-huella-pill justify-content-center mb-2">
                🌬️ <strong>−{resultado.co2} kg CO₂/año</strong> capturados
              </div>
              <div className="dash-huella-pill justify-content-center mb-4">
                📅 <strong>−{resultado.co2 * 10} kg CO₂</strong> en 10 años
              </div>

              {plantError && (
                <div className="alert alert-warning py-2 px-3 rounded-3 small mb-3">
                  {plantError}
                </div>
              )}

              {resultado.location && (
                <div className="mb-3 small text-muted">
                  📍 <strong>{resultado.location.address}</strong><br />
                  <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {resultado.location.lat.toFixed(5)}, {resultado.location.lng.toFixed(5)}
                  </span>
                </div>
              )}

              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <button className="btn btn-eco" onClick={handleNuevo}>
                  🌳 Plantar más
                </button>
                <Link to="/dashboard" className="btn dash-btn-swap px-3">
                  Volver al inicio
                </Link>
              </div>

              {resultado.location && GOOGLE_MAPS_API_KEY && (
                <div className="mt-4 card dash-reto-card">
                  <div className="card-body">
                    <p className="mb-1 fw-bold">Sitio de plantación</p>
                    <p className="small text-muted mb-2">{resultado.location.address}</p>
                    <div className="rounded-4 overflow-hidden" style={{ height: '240px' }}>
                      <TreeMapLeaflet center={resultado.location} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
            {/* Selector de árbol */}
            <section className="dash-card-section">
              <h6 className="dash-section-label mb-3">Elige tu árbol</h6>
              <div className="row g-2">
                {ARBOLES.map((a) => (
                  <div key={a.id} className="col-6">
                    <button
                      className={`pt-arbol-card w-100 ${selArbol.id === a.id ? 'pt-arbol-card--active' : ''}`}
                      onClick={() => setSelArbol(a)}
                    >
                      <span className="pt-arbol-icon">{a.icon}</span>
                      <span className="pt-arbol-nombre">{a.nombre}</span>
                      <span className="pt-arbol-co2">{a.co2_anual} kg CO₂/año</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Info del árbol seleccionado */}
            <section className="dash-card-section">
              <div className="card dash-reto-card">
                <div className="card-body">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <span style={{ fontSize: '2.5rem' }}>{selArbol.icon}</span>
                    <div>
                      <h6 className="dash-reto-title mb-0">{selArbol.nombre}</h6>
                      <small className="text-muted">Tiempo de madurez: {selArbol.tiempo}</small>
                    </div>
                  </div>
                  <p className="dash-reto-desc mb-0">{selArbol.descripcion}</p>
                </div>
              </div>
            </section>

            {/* Cantidad */}
            <section className="dash-card-section">
              <h6 className="dash-section-label mb-3">¿Cuántos árboles?</h6>
              <div className="d-flex gap-2 flex-wrap">
                {CANTIDADES.map((c) => (
                  <button
                    key={c}
                    className={`pt-cant-btn ${cantidad === c ? 'pt-cant-btn--active' : ''}`}
                    onClick={() => setCantidad(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </section>

            {/* Buscar ubicación */}
            <section className="dash-card-section">
              <h6 className="dash-section-label mb-3">Selecciona un sitio en el mapa</h6>
              <div className="card dash-reto-card">
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="locationSearch" className="form-label">
                      Dirección o ciudad (opcional)
                    </label>
                    
                    <div className="mb-2">
                        <button
                          type="button"
                          className="btn btn-eco"
                          onClick={handleGeolocate}
                        >
                          📍 Usar mi ubicación
                        </button>
                      </div>

                    <div className="input-group">
                      <input
                        id="locationSearch"
                        className="form-control"
                        type="text"
                        placeholder="Ej. Popayán, Colombia"
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleBuscarUbicacion()}
                      />
                      <button
                        type="button"
                        className="btn btn-eco"
                        onClick={handleBuscarUbicacion}
                        disabled={locationLoading}
                      >
                        {locationLoading ? (
                          <span className="spinner-border spinner-border-sm" />
                        ) : (
                          'Buscar'
                        )}
                      </button>
                    </div>
                    {locationError && (
                      <p className="text-danger small mt-2">{locationError}</p>
                    )}
                  </div>

                  {/* Mini-info de coordenadas cuando hay ubicación seleccionada */}
                  {selectedLocation && (
                    <div className="alert alert-success py-2 px-3 rounded-3 small mb-3 d-flex justify-content-between align-items-center">
                      <span>
                        📍 {selectedLocation.address}<br />
                        <span style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>
                          {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
                        </span>
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm ms-2"
                        onClick={() => {
                          setSelectedLocation(null);
                          localStorage.removeItem('eco_plant_location');
                        }}
                      >✕</button>
                    </div>
                  )}

                  <div className="pt-map-preview">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div>
                        <p className="mb-1 fw-bold">
                          {selectedLocation ? 'Ubicación seleccionada' : 'Mapa inicial'}
                        </p>
                        <p className="small text-muted mb-0">{defaultLocation.address}</p>
                      </div>
                    </div>
                    {GOOGLE_MAPS_API_KEY ? (
                      <div className="ratio ratio-16x9 rounded-4 overflow-hidden">
                      <div style={{ width: '100%', height: '100%' }}>
                        <TreeMapLeaflet center={defaultLocation} />
                      </div>
                    </div>

                    ) : (
                      <div className="text-center text-muted py-3 small">
                        Configura <code>VITE_GOOGLE_MAPS_API_KEY</code> para ver el mapa
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Resumen de impacto */}
            <section className="dash-card-section">
              <h6 className="dash-section-label mb-3">Impacto ambiental estimado</h6>
              <div className="card dash-huella-summary">
                <div className="card-body">
                  <div className="row g-3 text-center">
                    <div className="col-4">
                      <p className="pt-stat-val">{cantidad}</p>
                      <p className="pt-stat-label">Árbol{cantidad > 1 ? 'es' : ''}</p>
                    </div>
                    <div className="col-4">
                      <p className="pt-stat-val text-success">{impactoTotal}</p>
                      <p className="pt-stat-label">kg CO₂/año</p>
                    </div>
                    <div className="col-4">
                      <p className="pt-stat-val text-success">{impacto10años}</p>
                      <p className="pt-stat-label">kg CO₂/10 años</p>
                    </div>
                  </div>
                  <div className="progress mt-3" style={{ height: '8px' }}>
                    <div
                      className="progress-bar bg-success"
                      style={{ width: `${Math.min((impactoTotal / 200) * 100, 100)}%`, transition: 'width .5s ease' }}
                    />
                  </div>
                  <small className="text-muted d-block mt-1 text-center">
                    Equivale a {(impactoTotal / 120 * 100).toFixed(1)}% de la huella promedio colombiana anual
                  </small>
                </div>
              </div>
            </section>

            {/* Error al plantar */}
            {plantError && (
              <div className="alert alert-danger py-2 px-3 rounded-3 small mb-3">
                {plantError}
              </div>
            )}

            {/* Botón plantar */}
            <section className="dash-card-section pb-4">
              <button
                className="btn btn-eco w-100 py-2"
                onClick={handlePlantar}
                disabled={plantando}
              >
                {plantando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Plantando…
                  </>
                ) : (
                  `🌱 Plantar ${cantidad} ${selArbol.nombre}${cantidad > 1 ? 's' : ''} ahora`
                )}
              </button>
              {!selectedLocation && (
                <p className="text-muted small text-center mt-2 mb-0">
                  Se usará la ubicación predeterminada (Popayán) si no buscas una.
                </p>
              )}
            </section>
          </>
        )}
      </main>

      {/* Bottom nav */}
      <nav className="dash-bottom-nav">
        <Link to="/dashboard"  className="dash-nav-item">
          <span className="dash-nav-icon">🎯</span><span>Retos</span>
        </Link>
        <Link to="/history" className="dash-nav-item">
          <span className="dash-nav-icon">📋</span><span>Historial</span>
        </Link>
        <Link to="/plant-tree" className="dash-nav-item dash-nav-item--active">
          <span className="dash-nav-icon">🌳</span><span>Árbol</span>
        </Link>
        <Link to="/profile"    className="dash-nav-item">
          <span className="dash-nav-icon">👤</span><span>Perfil</span>
        </Link>
      </nav>
    </div>
  );

}

