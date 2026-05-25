import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { request } from '../service/api';

// Helper para obtener un nombre válido
async function getValidUsername(tree, userId) {
  let username = '';
  
  // Intentar obtener el nombre del árbol
  if (tree.data?.username) {
    username = tree.data.username;
  } else if (tree.username) {
    username = tree.username;
  }
  
  // Si está vacío, intentar obtener del servidor si tenemos userId
  if ((!username || username === 'Usuario') && userId) {
    try {
      const userData = await request(`/user/${userId}`);
      username = userData?.user?.name || 'Usuario';
    } catch (err) {
      console.log('No se pudo obtener nombre del servidor');
      username = 'Usuario';
    }
  }
  
  return username || 'Usuario';
}

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
        const userId = localStorage.getItem('eco_userId');
        
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

        for (const tree of trees) {
            console.log('TREE COMPLETO:', tree);
          let lat, lng;
          let nombre = 'Árbol';
          let usuario;
        
          // ✅ NUEVOS (history)
          if (tree.data?.location) {
            lat = parseFloat(tree.data.location.lat);
            lng = parseFloat(tree.data.location.lng);
            nombre = tree.data.treeName || tree.data.treeType;
            usuario = await getValidUsername(tree, userId);

          // ✅ ANTIGUOS (colección Tree)
          } else if (tree.location?.coordinates) {
            lat = tree.location.coordinates[1];
            lng = tree.location.coordinates[0];
            nombre = tree.tree_type;
            usuario = await getValidUsername(tree, userId);

          } else {
            console.log('❌ Árbol sin ubicación:', tree);
            continue;
          }

          // ✅ validar coordenadas
          if (!lat || !lng) {
            console.log('❌ Coordenadas inválidas:', { lat, lng });
            continue;
          }

          console.log('✅ Dibujando árbol:', lat, lng);

          const marker = L.marker([lat, lng]).addTo(mapInstance.current);

          marker.bindPopup(`
            <b>${nombre}</b><br/>
            👤 ${usuario}<br/>
            📅 ${new Date(tree.createdAt || tree.planted_at || Date.now()).toLocaleDateString()}<br/>
            📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}
          `);
        }

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