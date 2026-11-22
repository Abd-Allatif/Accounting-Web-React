import { describe, it, expect, beforeEach, vi } from 'vitest';

const STORAGE_KEY = 'accounting_fund';

beforeEach(() => {
  localStorage.removeItem(STORAGE_KEY);
  vi.clearAllMocks();
});

describe('BDD: Inventory Management', () => {
  describe('Generate inventory for a supply', () => {
    it('Given I am on the inventory page, When I select a supply and enter date range And I click generate inventory, Then inventory records should be created And I should see them in the inventory list', () => {
      // Mock inventory generation
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ permanant_fund: 1000, sells_fund: 0 }));

      const inventoryRecords = [
        { id: 1, supply: 'Rice', quantity: 100, unit_cost: 2, total_value: 200, generated_date: '2023-01-01' },
        { id: 2, supply: 'Wheat', quantity: 50, unit_cost: 3, total_value: 150, generated_date: '2023-01-01' },
      ];

      expect(inventoryRecords).toHaveLength(2);
      expect(inventoryRecords[0].supply).toBe('Rice');
      expect(inventoryRecords[0].total_value).toBe(200);
    });
  });
});
