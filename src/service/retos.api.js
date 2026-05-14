// src/service/retos.api.js
import { request } from './api';

export const getRetosDelDia = async (userId) => {
  const data = await request(`/challenge/daily/${userId}`);
  console.log('🔍 Respuesta daily:', data);

  const challenge = data.challenge;

  // Si el snapshot está incompleto (ya completado hoy pero sin title),
  // busca el reto completo desde /challenges/active
  if (!challenge.title) {
    const activos = await request('/challenges/active');
    const completo = activos.challenges.find(c => c.icon === challenge.icon);
    return [completo ?? activos.challenges[0]];
  }

  return [challenge];
};

export const getRetosActivos = async () => {
  const data = await request('/challenges/active');
  return data.challenges;
};

export const completarReto = async (userId, challenge) => {
  return await request('/challenge/complete', {
    method: 'POST',
    body: JSON.stringify({ userId, challenge }),
  });
};