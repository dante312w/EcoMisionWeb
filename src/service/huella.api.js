import { request } from './api';

export const guardarHuella = (data) => {
  return request('/history', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      action: 'HUELLA',
    }),
  });
};