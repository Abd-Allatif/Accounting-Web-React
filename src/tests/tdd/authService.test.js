import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { login, register, resetPassword, logout, guestLogin, refreshAccessToken } from '../../services/authService';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

let store = {};

beforeEach(() => {
  store = {};
  vi.clearAllMocks();
  Object.assign(globalThis, { localStorage: localStorageMock });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('authService', () => {
  describe('guestLogin', () => {
    it('sets guest tokens and flags in localStorage', () => {
      guestLogin();
      expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'guest_access_token');
      expect(localStorage.setItem).toHaveBeenCalledWith('refresh_token', 'guest_refresh_token');
      expect(localStorage.setItem).toHaveBeenCalledWith('user_data', JSON.stringify({ user_name: 'guest' }));
      expect(localStorage.setItem).toHaveBeenCalledWith('is_guest', 'true');
      expect(localStorage.getItem('is_guest')).toBe('true');
    });
  });

  describe('logout', () => {
    it('clears auth data from localStorage', async () => {
      await logout();
      expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refresh_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('user_data');
      expect(localStorage.removeItem).toHaveBeenCalledWith('is_guest');
    });
  });

  describe('refreshAccessToken', () => {
    it('returns guest token for guest users', async () => {
      localStorage.setItem('is_guest', 'true');
      const token = await refreshAccessToken();
      expect(token).toBe('guest_access_token');
    });
  });
});
