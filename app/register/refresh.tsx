import axios from 'axios';
import BASE_URL from '@/app/config';

export const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh');
  
  try {
    const res = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh });
    localStorage.setItem('access', res.data.access);
    return res.data.access;
  } catch (err) {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    window.location.href = '/login';
    return null;
  }
};
