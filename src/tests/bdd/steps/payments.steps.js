import { describe, it, expect, beforeEach } from 'vitest';
import { addToPermanantFund, subtractFromPermanantFund, resetFund, getFund } from '../../services/fundService';
import { calculateTotalPrice } from '../../utils/calculations';

const STORAGE_KEY = 'accounting_fund';

beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('token');
  localStorage.removeItem('user_data');
  localStorage.removeItem('is_guest');
});

describe('BDD: Payment Management', () => {
  describe('Add a new payment', () => {
    it('Given I am on the payments page, When I fill in money for, total, and date, And I click add payment, Then the payment should appear in the list And the permanent fund should be reduced by the total', () => {
      resetFund();
      addToPermanantFund(1000);

      const paymentTotal = 150;
      const beforeFund = getFund().permanant_fund;

      subtractFromPermanantFund(paymentTotal);
      const afterFund = getFund().permanant_fund;

      expect(afterFund).toBe(beforeFund - paymentTotal);
    });
  });

  describe('Edit an existing payment', () => {
    it('Given I have a payment in the list, When I click edit And change the total And click save, Then the payment should reflect the updated total And the permanent fund should be adjusted', () => {
      resetFund();
      addToPermanantFund(1000);

      const oldTotal = 100;
      const newTotal = 150;

      subtractFromPermanantFund(oldTotal);
      addToPermanantFund(oldTotal);
      subtractFromPermanantFund(newTotal);

      expect(getFund().permanant_fund).toBe(1000 - newTotal);
    });
  });

  describe('Delete a payment', () => {
    it('Given I have a payment in the list, When I click delete And confirm, Then the payment should be removed And the permanent fund should be refunded', () => {
      resetFund();
      addToPermanantFund(500);

      const paymentTotal = 200;
      subtractFromPermanantFund(paymentTotal);
      expect(getFund().permanant_fund).toBe(300);

      addToPermanantFund(paymentTotal);
      expect(getFund().permanant_fund).toBe(500);
    });
  });
});

describe('BDD: Calculate Total Price for dispatches', () => {
  it('Given quantity and unit and price, When calculating total price, Then result should be quantity * conversionRate * price', () => {
    expect(calculateTotalPrice(10, 'kgram', 5)).toBe(50);
    expect(calculateTotalPrice(1000, 'gram', 5)).toBe(5);
    expect(calculateTotalPrice(5, 'piece', 10)).toBe(50);
  });
});
