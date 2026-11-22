import { describe, it, expect } from 'vitest';
import {
  calculateUnit,
  calculateTotalPrice,
  calculateProfit,
  calculateProfitMargin,
  calculateTotal,
} from '../../utils/calculations';

describe('calculations', () => {
  describe('calculateUnit', () => {
    it('returns 1 for undefined/null unit', () => {
      expect(calculateUnit(undefined)).toBe(1);
      expect(calculateUnit(null)).toBe(1);
      expect(calculateUnit('')).toBe(1);
    });

    it('returns correct conversion rate for known units', () => {
      expect(calculateUnit('kgram')).toBe(1);
      expect(calculateUnit('gram')).toBe(0.001);
      expect(calculateUnit('piece')).toBe(1);
      expect(calculateUnit('peace')).toBe(1);
      expect(calculateUnit('unit')).toBe(1);
    });

    it('is case-insensitive', () => {
      expect(calculateUnit('KGram')).toBe(1);
      expect(calculateUnit('GRAM')).toBe(0.001);
      expect(calculateUnit('Piece')).toBe(1);
    });

    it('throws error for unknown unit', () => {
      expect(() => calculateUnit('invalid')).toThrow('Invalid unit: invalid');
      expect(() => calculateUnit('kg')).toThrow();
    });
  });

  describe('calculateTotalPrice', () => {
    it('calculates total price for kgram unit', () => {
      expect(calculateTotalPrice(10, 'kgram', 5)).toBe(50);
    });

    it('calculates total price for gram unit with conversion', () => {
      expect(calculateTotalPrice(1000, 'gram', 5)).toBe(5);
    });

    it('calculates total price for piece unit', () => {
      expect(calculateTotalPrice(5, 'piece', 10)).toBe(50);
    });

    it('returns 0 when quantity is 0', () => {
      expect(calculateTotalPrice(0, 'kgram', 100)).toBe(0);
    });

    it('returns 0 when price is 0', () => {
      expect(calculateTotalPrice(10, 'kgram', 0)).toBe(0);
    });

    it('throws error for invalid unit', () => {
      expect(() => calculateTotalPrice(10, 'invalid', 5)).toThrow();
    });
  });

  describe('calculateProfit', () => {
    it('returns revenue minus cost', () => {
      expect(calculateProfit(50, 100)).toBe(50);
      expect(calculateProfit(100, 100)).toBe(0);
      expect(calculateProfit(150, 100)).toBe(-50);
    });

    it('handles zero values', () => {
      expect(calculateProfit(0, 0)).toBe(0);
      expect(calculateProfit(0, 100)).toBe(100);
    });
  });

  describe('calculateProfitMargin', () => {
    it('returns percentage margin', () => {
      expect(calculateProfitMargin(50, 100)).toBe(50);
      expect(calculateProfitMargin(0, 100)).toBe(100);
      expect(calculateProfitMargin(100, 100)).toBe(0);
    });

    it('returns 0 when revenue is 0', () => {
      expect(calculateProfitMargin(50, 0)).toBe(0);
      expect(calculateProfitMargin(0, 0)).toBe(0);
    });
  });

  describe('calculateTotal', () => {
    it('sums item totals', () => {
      const items = [
        { total: 10 },
        { total: 20 },
        { total: 30 },
      ];
      expect(calculateTotal(items)).toBe(60);
    });

    it('falls back to price field', () => {
      const items = [
        { price: 5 },
        { price: 15 },
      ];
      expect(calculateTotal(items)).toBe(20);
    });

    it('returns 0 for empty array', () => {
      expect(calculateTotal([])).toBe(0);
    });

    it('treats missing values as 0', () => {
      const items = [{}, { total: 10 }];
      expect(calculateTotal(items)).toBe(10);
    });
  });
});
