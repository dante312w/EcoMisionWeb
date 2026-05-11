// src/services/api.js
// Capa de comunicación con tu REST API – EcoMisión
// Ajusta BASE_URL a la URL del backend

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ── Helper genérico ──────────────────────────────────────────────────────────
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('eco_token'); // JWT si lo usas
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }

  return res.json();
}

// ── Cuestionario ─────────────────────────────────────────────────────────────

/**
 * Envía las respuestas y la huella calculada al backend.
 * @param {string} userId
 * @param {object} respuestas  - { pregunta_id: value, ... }
 * @param {number} huellaKg    - kg CO₂/año calculado en frontend
 */
export async function guardarHuella(userId, respuestas, huellaKg) {
  return request('/huella', {
    method: 'POST',
    body: JSON.stringify({ userId, respuestas, huellaKg }),
  });
}

// ── Auth (ejemplos para conectar después) ────────────────────────────────────
export async function loginUser(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.token) localStorage.setItem('eco_token', data.token);
  return data;
}

export async function registerUser(nombre, email, password) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, password }),
  });
  if (data.token) localStorage.setItem('eco_token', data.token);
  return data;
}

// ── Retos ────────────────────────────────────────────────────────────────────
export async function getRetoDia(userId) {
  return request(`/retos/dia?userId=${userId}`);
}

export async function completarReto(retoId, userId) {
  return request(`/retos/${retoId}/completar`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}
