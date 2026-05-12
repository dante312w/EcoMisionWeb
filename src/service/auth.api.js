import { request } from './api';

export const loginUser = (email, password) => {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

export const registerUser = (name, email, password) => {
  return request('/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
};

// ✅ CERRAR SESIÓN
export function logout() {
  localStorage.removeItem('eco_token');
}