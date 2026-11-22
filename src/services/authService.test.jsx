import { describe, it, expect, vi } from 'vitest';
import { guestLogin } from './authService';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: vi.fn(key => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
global.localStorage = localStorageMock;

describe('authService', () => {
  it('guestLogin sets correct localStorage items', () => {
    guestLogin();
    expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'guest_access_token');
    expect(localStorage.setItem).toHaveBeenCalledWith('refresh_token', 'guest_refresh_token');
    expect(localStorage.setItem).toHaveBeenCalledWith('user_data', JSON.stringify({ user_name: 'guest' }));
    expect(localStorage.setItem).toHaveBeenCalledWith('is_guest', 'true');
    expect(localStorage.getItem('is_guest')).toBe('true');
  });
});
