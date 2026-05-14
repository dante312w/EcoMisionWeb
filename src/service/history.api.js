// src/service/history.api.js
import { request } from './api';

export const getHistorialUsuario = async (userId) => {
  const data = await request(`/history/user/${userId}`);
  return data.history ?? [];
};