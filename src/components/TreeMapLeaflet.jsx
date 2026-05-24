import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { request } from '../service/api';

export default function TreeMapLeaflet({ center }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // ✅ Crear mapa
  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current).setView(
      [center.lat, center.lng],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(mapInstance.current);

    return () => {
      mapInstance.current.remove();
      mapInstance.current = null;
    };
  }, []);

  // ✅ Cargar árboles
  useEffect(() => {
    if (!mapInstance.current) return;

    const loadTrees = async () => {
      try {
        // ✅ obtener ambos tipos
        const resHistory = await request('/history');
        const resTrees = await request('/trees/visible');

        console.log('HISTORY:', resHistory);
        console.log('TREES:', resTrees);

        const historyTrees = resHistory.history || [];
        const mapTrees = resTrees.trees || [];

        const trees = [...historyTrees, ...mapTrees];

        // ✅ limpiar markers anteriores
        mapInstance.current.eachLayer(layer => {
          if (layer instanceof L.Marker) {
            mapInstance.current.removeLayer(layer);
          }
        });

        trees.forEach(tree => {
            console.log('TREE COMPLETO:', tree);
          let lat, lng;
          let nombre = 'Árbol';
        
          // ✅ NUEVOS (history)
          if (tree.data?.location) {
            lat = parseFloat(tree.data.location.lat);
            lng = parseFloat(tree.data.location.lng);
            nombre = tree.data.treeName || tree.data.treeType;

          // ✅ ANTIGUOS (colección Tree)
          } else if (tree.location?.coordinates) {
            lat = tree.location.coordinates[1];
            lng = tree.location.coordinates[0];
            nombre = tree.tree_type;

          } else {
            console.log('❌ Árbol sin ubicación:', tree);
            return;
          }

          // ✅ validar coordenadas
          if (!lat || !lng) {
            console.log('❌ Coordenadas inválidas:', { lat, lng });
            return;
          }

          console.log('✅ Dibujando árbol:', lat, lng);

          const marker = L.marker([lat, lng]).addTo(mapInstance.current);

          marker.bindPopup(`
            <b>${nombre}</b><br/>
            👤 ${tree.username || 'Usuario'}<br/>
            📅 ${new Date(tree.createdAt || tree.planted_at || Date.now()).toLocaleDateString()}<br/>
            📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}
          `);
        });

      } catch (err) {
        console.error('❌ Error cargando árboles:', err);
      }
    };

    loadTrees();

  }, [center]);

  // ✅ Render
  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '16px'
      }}
    />
  );
}