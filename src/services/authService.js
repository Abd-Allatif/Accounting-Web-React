import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const login = async (identifier, password, onSuccess, onSetup) => {
  const response = await axios.post(`${API_URL}/users/token/`, { identifier, password });
  const data = response.data;
  if (data.access) {
    const userData = {
      user_name: data.user?.user_name || identifier,
      email: data.user?.email || '',
      issatup: data.user?.issatup || false,
      budget: data.user?.budget || 0,
    };
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('is_guest', 'false');
    if (userData.issatup) {
      if (onSuccess) onSuccess();
    } else {
      if (onSetup) onSetup();
    }
  }
  return data;
};

export const guestLogin = (onSuccess) => {
  localStorage.setItem('access_token', 'guest_access_token');
  localStorage.setItem('refresh_token', 'guest_refresh_token');
  localStorage.setItem('user_data', JSON.stringify({ user_name: 'guest' }));
  localStorage.setItem('is_guest', 'true');
  if (onSuccess) onSuccess('/main');
};

export const register = async (username, email, password, resetCode) => {
  const response = await axios.post(`${API_URL}/users/register/`, { username, email, password, resetCode });
  return response.data;
};

export const resetPassword = async (username, email, resetCode, newPassword) => {
  const response = await axios.post(`${API_URL}/users/reset-password/`, {
    username, email, reset_code: resetCode, new_password: newPassword,
  });
  return response.data;
};

export const refreshAccessToken = async () => {
  if (localStorage.getItem('is_guest') === 'true') return 'guest_access_token';
  const refresh = localStorage.getItem('refresh_token');
  const response = await axios.post(`${API_URL}/users/token/refresh/`, { refresh });
  localStorage.setItem('access_token', response.data.access);
  return response.data.access;
};

export const logout = async () => {
  const isGuest = localStorage.getItem('is_guest') === 'true';
  if (!isGuest) {
    const refresh = localStorage.getItem('refresh_token');
    try { await axios.post(`${API_URL}/users/logout/`, { refresh }); } catch (e) {}
  }
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_data');
  localStorage.removeItem('is_guest');
};

export default { login, guestLogin, register, resetPassword, refreshAccessToken, logout };
