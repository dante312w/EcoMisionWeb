import { request } from './api';

export const getHistoryByUser = (userId) => {
  return request(`/history/user/${userId}`);
};