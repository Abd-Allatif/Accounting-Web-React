const MOCK_STORAGE_KEY = 'accounting_mock_data';

const defaultMockData = {
  types: [ { id: 1, type_name: "Type A" }, { id: 2, type_name: "Type B" } ],
  supplies: [
    { id: 1, supply_name: "Supply 1", sell_price: 10, buy_price: 5, unit: "kg", type: "Type A", countity: 100 },
    { id: 2, supply_name: "Supply 2", sell_price: 20, buy_price: 12, unit: "pcs", type: "Type B", countity: 50 },
  ],
  sells: [ { id: 1, supply: "Supply 1", countity: 2, price: 10, total: 20, date: "2023-01-01", notes: "Mock sell" } ],
  customer_sells: [
      { id: 1, customer_name: "Guest Customer", supply: "Supply 1", countity: 1, price: 10, total: 10, debt: 5, paid: 5, date_of_buying: "2023-01-01", notes: "Mock customer sell" }
  ],
  employees: [ { id: 1, employee_name: "Guest Employee", salary: 1000, date_of_employment: "2023-01-01", job_title: "Sales" } ],
  customers: [ { id: 1, customer_name: "Guest Customer", phone_number: "0123456789", address: "Guest Address", total_debt: 500 } ],
  income: [ { id: 1, money_from: "Guest Customer", total: 100, date: "2023-01-01", notes: "Mock income" } ],
  payment: [ { id: 1, money_for: "Salary", total: 50, date: "2023-01-01", notes: "Mock payment" } ],
  reciepts: [ { id: 1, supply: "Supply 1", countity: 10, buy_price: 5, sell_price: 10, total: 50, date: "2023-01-01", notes: "Mock reciept" } ],
  dispatched: [ { id: 1, supply: "Supply 1", countity: 5, buy_price: 5, dispatch_date: "2023-01-01", reason: "Mock dispatch" } ],
  funds: { sells_fund: 1000, permanant_fund: 5000 }
};

const getStoredData = () => {
    const stored = localStorage.getItem(MOCK_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(defaultMockData));
    return defaultMockData;
};

const saveStoredData = (data) => {
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(data));
};

export const getMockData = (key) => {
    const data = getStoredData();
    return data[key] || [];
};

export const searchMockData = (key, query) => {
  const data = getMockData(key);
  if (!query) return data;
  return data.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(query.toLowerCase())));
};

export const addMockData = (key, newItem) => {
    const data = getStoredData();
    if (!data[key]) data[key] = [];
    const itemWithId = { ...newItem, id: Date.now() };
    data[key].push(itemWithId);
    saveStoredData(data);
    return itemWithId;
};

export const updateMockData = (key, id, updatedFields) => {
    const data = getStoredData();
    if (!data[key]) return;
    data[key] = data[key].map(item => {
        if (item.id === id || item.customer_name === id || item.employee_name === id || item.type_name === id || item.supply_name === id) {
            return { ...item, ...updatedFields };
        }
        return item;
    });
    saveStoredData(data);
};

export const deleteMockData = (key, id) => {
    const data = getStoredData();
    if (!data[key]) return;
    data[key] = data[key].filter(item => {
        return item.id !== id && item.customer_name !== id && item.employee_name !== id && item.type_name !== id && item.supply_name !== id;
    });
    saveStoredData(data);
};

export default getStoredData();
