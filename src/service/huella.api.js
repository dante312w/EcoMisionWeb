import { request } from './api';

export const guardarHuella = async (userId, respuestas, huellaKg) => {
  try {
    // ✅ Guardar la huella en el historial
    await request('/history', {
      method: 'POST',
      body: {
        user_id: userId,
        respuestas,
        huella_kg: huellaKg,
        action: 'HUELLA',
      },
    });

    // ✅ Marcar el quiz como completado en el usuario
    await request(`/user/${userId}`, {
      method: 'PUT',
      body: {
        first_quiz_completed: true,
      },
    });

  } catch (err) {
    console.error('Error guardando huella:', err);
    throw err;
  }
};