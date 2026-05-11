// src/pages/PlantTree.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';

const ARBOLES = [
  { id: 'roble',    nombre: 'Roble',      icon: '🌳', co2_anual: 21,  tiempo: '5-10 años', descripcion: 'Árbol longevo que absorbe hasta 21 kg de CO₂/año en su madurez.' },
  { id: 'pino',     nombre: 'Pino',       icon: '🌲', co2_anual: 11,  tiempo: '3-5 años',  descripcion: 'Crece rápido y es ideal para reforestación en zonas altas.' },
  { id: 'mango',    nombre: 'Mango',      icon: '🥭', co2_anual: 8,   tiempo: '2-4 años',  descripcion: 'Árbol frutal tropical que combina producción de alimentos y captura de CO₂.' },
  { id: 'bambú',    nombre: 'Bambú',      icon: '🎋', co2_anual: 35,  tiempo: '1-2 años',  descripcion: 'El bambú captura CO₂ 25 veces más rápido que cualquier árbol.' },
  { id: 'aguacate', nombre: 'Aguacate',   icon: '🫒', co2_anual: 6,   tiempo: '3-6 años',  descripcion: 'Frutal popular en Colombia que también contribuye a la captura de carbono.' },
];

const CANTIDADES = [1, 3, 5, 10, 20];

export default function PlantTree() {
  const [selArbol,    setSelArbol]    = useState(ARBOLES[0]);
  const [cantidad,    setCantidad]    = useState(1);
  const [plantando,   setPlantando]   = useState(false);
  const [resultado,   setResultado]   = useState(null);
  const [plantados,   setPlantados]   = useState(
    parseInt(localStorage.getItem('eco_arboles') ?? '0', 10)
  );
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(
    JSON.parse(localStorage.getItem('eco_plant_location') || 'null')
  );
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const defaultLocation = selectedLocation || {
    lat: 4.7110,
    lng: -74.0721,
    address: 'Bogotá, Colombia',
  };

  const impactoTotal  = selArbol.co2_anual * cantidad;
  const impacto10años = impactoTotal * 10;

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
      const data = await response.json();

      if (data.status !== 'OK' || !data.results?.length) {
        throw new Error('No se encontró la ubicación.');
      }

      const result = data.results[0];
      const { lat, lng } = result.geometry.location;
      const location = {
        address: result.formatted_address,
        lat,
        lng,
      };
      setSelectedLocation(location);
      localStorage.setItem('eco_plant_location', JSON.stringify(location));
    } catch (err) {
      setLocationError(err.message || 'Error al buscar la ubicación.');
    } finally {
      setLocationLoading(false);
    }
  };

  const handlePlantar = async () => {
    setPlantando(true);
    // TODO: await api.plantarArbol({ arbol: selArbol.id, cantidad, location: selectedLocation })
    await new Promise((r) => setTimeout(r, 1400));
    const nuevos = plantados + cantidad;
    setPlantados(nuevos);
    localStorage.setItem('eco_arboles', nuevos);
    setResultado({ arbol: selArbol, cantidad, co2: impactoTotal, location: selectedLocation });
    setPlantando(false);
  };

  const handleNuevo = () => setResultado(null);

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
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                <button className="btn btn-eco" onClick={handleNuevo}>
                  🌳 Plantar más
                </button>
                <Link to="/dashboard" className="btn dash-btn-swap px-3">
                  Volver al inicio
                </Link>
              </div>

              {resultado.location ? (
                <div className="mt-4 card dash-reto-card">
                  <div className="card-body">
                    <p className="mb-1 fw-bold">Sitio de plantación</p>
                    <p className="small text-muted mb-2">{resultado.location.address}</p>
                    <div className="ratio ratio-16x9 rounded-4 overflow-hidden">
                      <iframe
                        title="Ubicación del árbol plantado"
                        src={`https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=${resultado.location.lat},${resultado.location.lng}&zoom=15`}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                </div>
              ) : null}
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
                    <div className="input-group">
                      <input
                        id="locationSearch"
                        className="form-control"
                        type="text"
                        placeholder="Ej. Bogotá, Colombia"
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
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

                  <div className="pt-map-preview">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div>
                        <p className="mb-1 fw-bold">
                          {selectedLocation ? 'Ubicación seleccionada' : 'Mapa inicial'}
                        </p>
                        <p className="small text-muted mb-0">{defaultLocation.address}</p>
                      </div>
                      {selectedLocation && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setSelectedLocation(null)}
                        >Cambiar</button>
                      )}
                    </div>
                    <div className="ratio ratio-16x9 rounded-4 overflow-hidden">
                      <iframe
                        title="Mapa de ubicación de plantación"
                        src={`https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=${defaultLocation.lat},${defaultLocation.lng}&zoom=13`}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
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
            </section>
          </>
        )}
      </main>

      {/* Bottom nav */}
      <nav className="dash-bottom-nav">
        <Link to="/dashboard"  className="dash-nav-item">
          <span className="dash-nav-icon">🎯</span><span>Retos</span>
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
