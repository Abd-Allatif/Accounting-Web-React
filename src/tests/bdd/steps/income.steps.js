import { describe, it, expect, beforeEach, vi } from 'vitest';
import { addToSellsFund, getFund, resetFund } from '../../services/fundService';

const STORAGE_KEY = 'accounting_fund';

beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY);
  vi.clearAllMocks();
});

describe('BDD: Income Management', () => {
  describe('Add a new income record', () => {
    it('Given I am on the income page, When I fill in money from, total, and date, And I click add income, Then the income should appear in the list And the sells fund should be increased by the total', () => {
      resetFund();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ permanant_fund: 0, sells_fund: 0 }));

      const incomeTotal = 300;
      addToSellsFund(incomeTotal);

      expect(getFund().sells_fund).toBe(incomeTotal);
    });
  });
});
