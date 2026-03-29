import { describe, it, expect } from 'vitest';
import { getMockData, searchMockData } from './mockService';

describe('mockService', () => {
  it('getMockData returns data for valid key', () => {
    const supplies = getMockData('supplies');
    expect(supplies.length).toBeGreaterThan(0);
    expect(supplies[0].supply_name).toBe('Supply 1');
  });

  it('searchMockData filters data correctly', () => {
    const results = searchMockData('supplies', 'Supply 2');
    expect(results).toHaveLength(1);
    expect(results[0].supply_name).toBe('Supply 2');
  });
});
