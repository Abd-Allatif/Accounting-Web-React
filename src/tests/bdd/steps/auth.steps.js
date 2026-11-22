import { describe, it, expect, beforeEach } from 'vitest';
import { guestLogin } from '../../services/authService';
import {
  addToPermanantFund,
  subtractFromPermanantFund,
  resetFund,
  getFund,
  addToSellsFund,
} from '../../services/fundService';

const STORAGE_KEY = 'accounting_fund';

beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('token');
  localStorage.removeItem('user_data');
  localStorage.removeItem('is_guest');
});

describe('BDD: User Authentication', () => {
  describe('Guest login', () => {
    it('Given I am on the login page, When I choose to continue as guest, Then I should be in guest mode', () => {
      guestLogin();
      expect(localStorage.getItem('is_guest')).toBe('true');
      expect(localStorage.getItem('user_data')).toContain('guest');
    });
  });
});

describe('BDD: Fund Calculations (used by payments, dispatches, income)', () => {
  describe('Permanant fund management', () => {
    it('Given I have sufficient funds, When I add a payment, Then the permanant fund should be reduced', () => {
      addToPermanantFund(500);
      const before = getFund().permanant_fund;
      subtractFromPermanantFund(50);
      const after = getFund().permanant_fund;
      expect(after).toBe(before - 50);
    });

    it('Given I have no funds, When I try to spend, Then the fund can go negative', () => {
      resetFund();
      subtractFromPermanantFund(100);
      expect(getFund().permanant_fund).toBe(-100);
    });

    it('Given I add income, Then the sells fund should increase', () => {
      resetFund();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ permanant_fund: 0, sells_fund: 0 }));
      addToSellsFund(200);
      expect(getFund().sells_fund).toBe(200);
    });
  });
});
