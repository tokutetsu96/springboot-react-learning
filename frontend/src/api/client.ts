import axios from 'axios';

export const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message ?? error.message ?? '不明なエラーが発生しました';
    return Promise.reject(new Error(message));
  },
);
