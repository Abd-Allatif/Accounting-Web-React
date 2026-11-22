import { describe, it, expect, vi } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  parseMoney,
  isValidEmail,
  isValidPassword,
  generateResetCode,
  debounce,
} from '../../utils/helpers';

describe('helpers', () => {
  describe('formatCurrency', () => {
    it('formats a number with 2 decimal places', () => {
      expect(formatCurrency(10)).toBe('10.00');
      expect(formatCurrency(10.5)).toBe('10.50');
      expect(formatCurrency(10.567)).toBe('10.57');
    });

    it('returns 0.00 for NaN', () => {
      expect(formatCurrency(NaN)).toBe('0.00');
      expect(formatCurrency('abc')).toBe('0.00');
      expect(formatCurrency(undefined)).toBe('0.00');
    });

    it('handles negative numbers', () => {
      expect(formatCurrency(-5)).toBe('-5.00');
    });
  });

  describe('formatDate', () => {
    it('returns - for empty value', () => {
      expect(formatDate('')).toBe('-');
      expect(formatDate(null)).toBe('-');
      expect(formatDate(undefined)).toBe('-');
    });

    it('formats a date string', () => {
      const result = formatDate('2023-01-15');
      expect(result).toContain('2023');
      expect(result).toContain('15');
    });
  });

  describe('formatDateTime', () => {
    it('returns - for empty value', () => {
      expect(formatDateTime('')).toBe('-');
    });

    it('includes time in output', () => {
      const result = formatDateTime('2023-01-15T10:30:00');
      expect(result).toContain('2023');
      expect(result).toMatch(/\d{2}:\d{2}/);
    });
  });

  describe('parseMoney', () => {
    it('parses a number', () => {
      expect(parseMoney('10.50')).toBe(10.5);
      expect(parseMoney(10)).toBe(10);
    });

    it('returns 0 for invalid input', () => {
      expect(parseMoney('abc')).toBe(0);
      expect(parseMoney(undefined)).toBe(0);
      expect(parseMoney(null)).toBe(0);
    });
  });

  describe('isValidEmail', () => {
    it('accepts valid emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@domain.co.uk')).toBe(true);
    });

    it('rejects invalid emails', () => {
      expect(isValidEmail('not-an-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('accepts strong passwords', () => {
      expect(isValidPassword('Password1!')).toBe(true);
      expect(isValidPassword('Str0ng#Pass')).toBe(true);
    });

    it('rejects weak passwords', () => {
      expect(isValidPassword('weak')).toBe(false);
      expect(isValidPassword('nouppercase1!')).toBe(false);
      expect(isValidPassword('NOLOWER1!')).toBe(false);
      expect(isValidPassword('Password')).toBe(false);
      expect(isValidPassword('Password1')).toBe(false);
      expect(isValidPassword('')).toBe(false);
    });
  });

  describe('generateResetCode', () => {
    it('generates a code of specified length', () => {
      const code = generateResetCode(10);
      expect(code).toHaveLength(10);
    });

    it('uses default length of 10', () => {
      const code = generateResetCode();
      expect(code).toHaveLength(10);
    });

    it('generates different codes on each call', () => {
      const code1 = generateResetCode(20);
      const code2 = generateResetCode(20);
      expect(code1).not.toBe(code2);
    });

    it('only contains allowed characters', () => {
      const code = generateResetCode(100);
      const validChars = /^[A-Za-z0-9]+$/;
      expect(validChars.test(code)).toBe(true);
    });
  });

  describe('debounce', () => {
    it('delays function execution', async () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 50);
      debounced('a');
      debounced('b');
      expect(fn).not.toHaveBeenCalled();
      await new Promise((r) => setTimeout(r, 100));
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenLastCalledWith('b');
    });
  });
});
