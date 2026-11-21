import { describe, it, expect, vi } from 'vitest';
import { guestLogin } from './authService';

// Mock localStorage
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
    const onSuccess = vi.fn();
    guestLogin(onSuccess);
    expect(localStorage.setItem).toHaveBeenCalledWith('is_guest', 'true');
    expect(localStorage.getItem('is_guest')).toBe('true');
    expect(onSuccess).toHaveBeenCalledWith('/main');
  });
});
