import { describe, it, expect, beforeEach } from 'vitest';
import {
  getFund,
  saveFund,
  resetFund,
  addToPermanantFund,
  subtractFromPermanantFund,
  addToSellsFund,
  subtractFromSellsFund,
  moveSellsToPerma,
  updateBudget,
} from '../../services/fundService';

const STORAGE_KEY = 'accounting_fund';

beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY);
});

describe('fundService', () => {
  describe('getFund', () => {
    it('returns default fund when no stored data', () => {
      const fund = getFund();
      expect(fund.permanant_fund).toBe(0);
      expect(fund.sells_fund).toBe(0);
    });

    it('returns stored fund data', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ permanant_fund: 100, sells_fund: 50 }));
      const fund = getFund();
      expect(fund.permanant_fund).toBe(100);
      expect(fund.sells_fund).toBe(50);
    });

    it('handles corrupt stored data gracefully', () => {
      localStorage.setItem(STORAGE_KEY, 'not-json');
      const fund = getFund();
      expect(fund.permanant_fund).toBe(0);
      expect(fund.sells_fund).toBe(0);
    });
  });

  describe('saveFund', () => {
    it('persists fund to localStorage', () => {
      const fund = saveFund({ permanant_fund: 200, sells_fund: 75 });
      expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify({ permanant_fund: 200, sells_fund: 75 }));
      expect(fund.permanant_fund).toBe(200);
      expect(fund.sells_fund).toBe(75);
    });
  });

  describe('resetFund', () => {
    it('clears stored fund and returns defaults', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ permanant_fund: 100, sells_fund: 50 }));
      const fund = resetFund();
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
      expect(fund.permanant_fund).toBe(0);
      expect(fund.sells_fund).toBe(0);
    });
  });

  describe('addToPermanantFund', () => {
    it('adds amount to permanant fund', () => {
      const result = addToPermanantFund(100);
      expect(result.permanant_fund).toBe(100);
      expect(result.sells_fund).toBe(0);
    });

    it('accumulates across calls', () => {
      addToPermanantFund(50);
      const result = addToPermanantFund(30);
      expect(result.permanant_fund).toBe(80);
    });
  });

  describe('subtractFromPermanantFund', () => {
    it('subtracts amount from permanant fund', () => {
      addToPermanantFund(100);
      const result = subtractFromPermanantFund(30);
      expect(result.permanant_fund).toBe(70);
    });

    it('allows negative balance', () => {
      const result = subtractFromPermanantFund(50);
      expect(result.permanant_fund).toBe(-50);
    });
  });

  describe('addToSellsFund', () => {
    it('adds amount to sells fund', () => {
      const result = addToSellsFund(100);
      expect(result.sells_fund).toBe(100);
    });

    it('accumulates across calls', () => {
      addToSellsFund(40);
      const result = addToSellsFund(60);
      expect(result.sells_fund).toBe(100);
    });
  });

  describe('subtractFromSellsFund', () => {
    it('subtracts amount from sells fund', () => {
      addToSellsFund(100);
      const result = subtractFromSellsFund(30);
      expect(result.sells_fund).toBe(70);
    });
  });

  describe('moveSellsToPerma', () => {
    it('moves amount from sells to permanant fund', () => {
      addToSellsFund(100);
      const result = moveSellsToPerma(40);
      expect(result.sells_fund).toBe(60);
      expect(result.permanant_fund).toBe(40);
    });

    it('throws when insufficient sells fund', () => {
      addToSellsFund(10);
      expect(() => moveSellsToPerma(50)).toThrow('Insufficient sells fund');
    });
  });

  describe('updateBudget', () => {
    it('adjusts permanant fund by budget difference', () => {
      addToPermanantFund(100);
      const result = updateBudget(30, 50);
      expect(result.permanant_fund).toBe(120);
    });

    it('handles decreasing budget', () => {
      addToPermanantFund(100);
      const result = updateBudget(50, 30);
      expect(result.permanant_fund).toBe(80);
    });
  });
});
