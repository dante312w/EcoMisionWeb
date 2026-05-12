// src/service/api.js

const BASE_URL = import.meta.env.VITE_API_URL;

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('eco_token');

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  // 🔴 TOKEN INVÁLIDO / EXPIRADO
  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('eco_token');
    throw new Error('Tu sesión expiró. Por favor inicia sesión de nuevo.');
  }

  if (!response.ok) {
    throw new Error(data?.message || `Error ${response.status}`);
  }

  return data;
}