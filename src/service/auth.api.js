// src/service/auth.api.js
import { request } from './api';

// Puntos por reto completado (debe coincidir con tu lógica del Dashboard)
const PUNTOS_POR_RETO = 20;

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export const loginUser = async (email, password) => {
  const data = await request('/login', {
    method: 'POST',
    body: { email, password },
  });

  if (!data?.token) throw new Error('No se recibió token de autenticación');

  const payload = decodeJwt(data.token);
  if (!payload?.id) throw new Error('Token inválido');

  localStorage.setItem('eco_token',     data.token);
  localStorage.setItem('eco_userId',    payload.id);
  localStorage.setItem('eco_userEmail', payload.email);

  // Traer perfil del usuario para restaurar puntos
  try {
    const userData = await request(`/user/${payload.id}`);
    const completados = userData?.user?.profile?.challenges_completed ?? 0;
    const puntos = completados * PUNTOS_POR_RETO;
    localStorage.setItem('eco_puntos', puntos);
    localStorage.setItem('eco_userName', userData?.user?.name ?? '');
  } catch {
    // Si falla, dejamos los puntos en 0 (no bloqueamos el login)
    localStorage.setItem('eco_puntos', '0');
  }

  return data;
};

export const registerUser = async ({ name, email, password }) => {
  return await request('/register', {
    method: 'POST',
    body: { name, email, password },
  });
};

export const logout = () => {
  ['eco_token', 'eco_userId', 'eco_userEmail', 'eco_huella', 'eco_puntos', 'eco_userName']
    .forEach(k => localStorage.removeItem(k));
};