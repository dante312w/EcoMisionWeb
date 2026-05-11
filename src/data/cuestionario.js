// src/data/cuestionario.js
// Preguntas del cuestionario de huella de carbono – EcoMisión
// Cada opción tiene un valor en kg CO₂/año estimado

export const secciones = [
  {
    id: 'transporte',
    titulo: 'Transporte',
    emoji: '🚗',
    descripcion: '¿Cómo te mueves en tu día a día?',
    color: '#4a8c3f',
    preguntas: [
      {
        id: 'medio_transporte',
        texto: '¿Cuál es tu medio de transporte principal?',
        tipo: 'radio',
        opciones: [
          { label: '🚌 Transporte público',       value: 'bus',       co2: 820  },
          { label: '🚗 Carro propio (gasolina)',   value: 'carro',     co2: 4600 },
          { label: '🛵 Moto',                      value: 'moto',      co2: 1800 },
          { label: '🚲 Bicicleta / a pie',         value: 'bici',      co2: 0    },
          { label: '🚕 Taxi / Uber frecuente',     value: 'taxi',      co2: 3200 },
        ],
      },
      {
        id: 'frecuencia_vuelos',
        texto: '¿Con qué frecuencia viajas en avión al año?',
        tipo: 'radio',
        opciones: [
          { label: '✈️ Nunca',              value: 'nunca',     co2: 0    },
          { label: '✈️ 1–2 vuelos cortos',  value: 'poco',      co2: 700  },
          { label: '✈️ 3–5 vuelos',         value: 'medio',     co2: 2200 },
          { label: '✈️ Más de 5 vuelos',    value: 'mucho',     co2: 5000 },
        ],
      },
      {
        id: 'km_semana',
        texto: 'Si usas vehículo propio, ¿cuántos km recorres por semana?',
        tipo: 'radio',
        opciones: [
          { label: '🚫 No uso vehículo',    value: 'cero',      co2: 0    },
          { label: '📍 Menos de 50 km',     value: 'poco',      co2: 400  },
          { label: '📍 50–150 km',          value: 'medio',     co2: 1100 },
          { label: '📍 Más de 150 km',      value: 'mucho',     co2: 2400 },
        ],
      },
    ],
  },
  {
    id: 'energia',
    titulo: 'Energía en casa',
    emoji: '⚡',
    descripcion: '¿Cómo consumes energía en tu hogar?',
    color: '#e6a817',
    preguntas: [
      {
        id: 'fuente_energia',
        texto: '¿Cuál es tu principal fuente de energía en casa?',
        tipo: 'radio',
        opciones: [
          { label: '☀️ Solar / renovable',          value: 'solar',     co2: 100  },
          { label: '💡 Red eléctrica',              value: 'electrica', co2: 1200 },
          { label: '🔥 Gas natural',                value: 'gas',       co2: 2000 },
          { label: '🪵 Leña / carbón',              value: 'lena',      co2: 3500 },
        ],
      },
      {
        id: 'consumo_electrico',
        texto: '¿Cuánto pagas aproximadamente de luz al mes?',
        tipo: 'radio',
        opciones: [
          { label: '💚 Menos de $30.000 COP',       value: 'bajo',      co2: 300  },
          { label: '🟡 $30.000 – $80.000 COP',      value: 'medio',     co2: 900  },
          { label: '🔴 Más de $80.000 COP',         value: 'alto',      co2: 1800 },
        ],
      },
      {
        id: 'aire_acondicionado',
        texto: '¿Usas aire acondicionado o calefacción?',
        tipo: 'radio',
        opciones: [
          { label: '❌ Nunca',                      value: 'nunca',     co2: 0    },
          { label: '🌤️ Solo en temporadas',         value: 'a_veces',   co2: 500  },
          { label: '🌡️ Todo el tiempo',             value: 'siempre',   co2: 1500 },
        ],
      },
    ],
  },
  {
    id: 'alimentacion',
    titulo: 'Alimentación',
    emoji: '🥗',
    descripcion: '¿Qué hay en tu plato?',
    color: '#e05c2a',
    preguntas: [
      {
        id: 'dieta',
        texto: '¿Cómo describirías tu dieta habitual?',
        tipo: 'radio',
        opciones: [
          { label: '🌱 Vegana',                     value: 'vegana',    co2: 600  },
          { label: '🥦 Vegetariana',                value: 'vegeta',    co2: 1000 },
          { label: '🐟 Pescado y vegetales',        value: 'pescado',   co2: 1500 },
          { label: '🍗 Carne de pollo/cerdo',       value: 'pollo',     co2: 2200 },
          { label: '🥩 Carne de res frecuente',     value: 'res',       co2: 3300 },
        ],
      },
      {
        id: 'comida_procesada',
        texto: '¿Con qué frecuencia consumes comida procesada o empacada?',
        tipo: 'radio',
        opciones: [
          { label: '✅ Casi nunca',                 value: 'nunca',     co2: 100  },
          { label: '🟡 A veces (2–3 veces/semana)', value: 'aveces',    co2: 400  },
          { label: '🔴 Casi todos los días',        value: 'siempre',   co2: 900  },
        ],
      },
      {
        id: 'desperdicio',
        texto: '¿Cuánto alimento desperdicias a la semana?',
        tipo: 'radio',
        opciones: [
          { label: '🌟 Casi nada',                  value: 'nada',      co2: 50   },
          { label: '🟡 Un poco',                    value: 'poco',      co2: 300  },
          { label: '🔴 Bastante',                   value: 'mucho',     co2: 700  },
        ],
      },
    ],
  },
  {
    id: 'residuos',
    titulo: 'Residuos',
    emoji: '♻️',
    descripcion: '¿Qué haces con tu basura?',
    color: '#2a7abf',
    preguntas: [
      {
        id: 'reciclaje',
        texto: '¿Reciclas en casa?',
        tipo: 'radio',
        opciones: [
          { label: '✅ Siempre, separo todo',        value: 'siempre',   co2: 0    },
          { label: '🟡 A veces',                    value: 'aveces',    co2: 200  },
          { label: '❌ Casi nunca',                  value: 'nunca',     co2: 500  },
        ],
      },
      {
        id: 'bolsas_plasticas',
        texto: '¿Usas bolsas plásticas al comprar?',
        tipo: 'radio',
        opciones: [
          { label: '🛍️ Siempre llevo bolsa reutilizable', value: 'reutilizable', co2: 0   },
          { label: '🟡 A veces uso plástico',              value: 'aveces',       co2: 100 },
          { label: '🔴 Siempre uso bolsas plásticas',      value: 'siempre',      co2: 300 },
        ],
      },
      {
        id: 'residuos_electronicos',
        texto: '¿Qué haces con tus dispositivos electrónicos viejos?',
        tipo: 'radio',
        opciones: [
          { label: '♻️ Los llevo a un punto de reciclaje', value: 'recicla',  co2: 0   },
          { label: '📦 Los guardo sin usar',               value: 'guarda',   co2: 150 },
          { label: '🗑️ Los boto a la basura normal',       value: 'bota',     co2: 500 },
        ],
      },
    ],
  },
];

// ── Utilidad: calcula CO₂ total a partir de respuestas ──────────────────────
// respuestas = { pregunta_id: value, ... }
export function calcularHuella(respuestas) {
  let total = 0;
  for (const seccion of secciones) {
    for (const pregunta of seccion.preguntas) {
      const valorSeleccionado = respuestas[pregunta.id];
      if (!valorSeleccionado) continue;
      const opcion = pregunta.opciones.find((o) => o.value === valorSeleccionado);
      if (opcion) total += opcion.co2;
    }
  }
  return total; // kg CO₂/año
}

// ── Clasifica la huella ─────────────────────────────────────────────────────
export function clasificarHuella(kgCO2) {
  if (kgCO2 < 3000)  return { nivel: 'bajo',   label: 'Huella Baja 🌿',    color: '#4a8c3f' };
  if (kgCO2 < 7000)  return { nivel: 'medio',  label: 'Huella Media 🌍',   color: '#e6a817' };
  if (kgCO2 < 12000) return { nivel: 'alto',   label: 'Huella Alta 🔥',    color: '#e05c2a' };
  return                    { nivel: 'critico', label: 'Huella Crítica 💨', color: '#c0392b' };
}
