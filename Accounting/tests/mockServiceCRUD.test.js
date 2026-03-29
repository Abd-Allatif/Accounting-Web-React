import { it, expect, describe, beforeEach } from 'vitest';
import { getMockData, addMockData, updateMockData, deleteMockData } from '../src/services/mockService';

describe('mockService CRUD', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should add data to localStorage', () => {
        const newItem = { customer_name: 'New Customer' };
        addMockData('customers', newItem);
        const data = getMockData('customers');
        expect(data.some(c => c.customer_name === 'New Customer')).toBe(true);
    });

    it('should update data in localStorage', () => {
        updateMockData('customers', 'Guest Customer', { phone_number: '111' });
        const data = getMockData('customers');
        const updated = data.find(c => c.customer_name === 'Guest Customer');
        expect(updated.phone_number).toBe('111');
    });

    it('should delete data from localStorage', () => {
        deleteMockData('customers', 'Guest Customer');
        const data = getMockData('customers');
        expect(data.some(c => c.customer_name === 'Guest Customer')).toBe(false);
    });
});
