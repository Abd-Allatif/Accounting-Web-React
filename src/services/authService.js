import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}`;

export const login = async (identifier, password, navigate1, navigate2) => {
  const response = await axios.post(`${API_URL}/token/`, { identifier, password });
  if (response.data.access) {
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    localStorage.setItem('user_data', JSON.stringify({ "user_name": response.data.user.user_name }));
    localStorage.setItem('is_guest', 'false');
    response.data.user.issatup ? navigate1() : navigate2();
  }
  return response.data;
};

export const guestLogin = (onSuccess) => {
  localStorage.setItem('access_token', 'guest_access_token');
  localStorage.setItem('refresh_token', 'guest_refresh_token');
  localStorage.setItem('user_data', JSON.stringify({ "user_name": "guest" }));
  localStorage.setItem('is_guest', 'true');
  onSuccess('/main');
};

export const logout = async () => {
  const isGuest = localStorage.getItem('is_guest') === 'true';
  if (!isGuest) {
    const refresh = localStorage.getItem('refresh_token');
    try { await axios.post(`${API_URL}/logout/`, { refresh }); } catch (e) {}
  }
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_data');
  localStorage.removeItem('is_guest');
};

export const refreshAccessToken = async () => {
  if (localStorage.getItem('is_guest') === 'true') return 'guest_access_token';
  const refresh = localStorage.getItem('refresh_token');
  try {
    const response = await axios.post(`${API_URL}/token/refresh/`, { refresh });
    localStorage.setItem('access_token', response.data.access);
    return response.data.access;
  } catch (error) { throw error; }
};
