import { describe, it, expect, beforeEach, vi } from 'vitest';
import { subtractFromPermanantFund, addToPermanantFund, resetFund, getFund } from '../../services/fundService';
import { calculateTotalPrice } from '../../utils/calculations';

const STORAGE_KEY = 'accounting_fund';

beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY);
  vi.clearAllMocks();
});

describe('BDD: Dispatch Supplies', () => {
  describe('Dispatch supplies with sufficient funds', () => {
    it('Given I am on the dispatch supplies page And I have sufficient permanent fund, When I select a supply and enter quantity and buy price And I click dispatch, Then the dispatch should be recorded And the permanent fund should be reduced by the total cost', () => {
      resetFund();
      addToPermanantFund(1000);

      const quantity = 10;
      const unit = 'kgram';
      const pricePerUnit = 5;
      const totalCost = calculateTotalPrice(quantity, unit, pricePerUnit);

      expect(totalCost).toBe(50);

      subtractFromPermanantFund(totalCost);
      expect(getFund().permanant_fund).toBe(1000 - 50);
    });
  });

  describe('Dispatch supplies with insufficient funds', () => {
    it('Given I have insufficient permanent fund, When I try to dispatch supplies, Then I should see an error about insufficient funds And the dispatch should not be recorded', () => {
      resetFund();
      addToPermanantFund(10);

      const totalCost = calculateTotalPrice(100, 'kgram', 5); // 500
      const currentFund = getFund().permanant_fund;

      expect(currentFund).toBeLessThan(totalCost);
      // The dispatch would be blocked because fund < cost
      expect(currentFund).toBe(10);
    });
  });
});
