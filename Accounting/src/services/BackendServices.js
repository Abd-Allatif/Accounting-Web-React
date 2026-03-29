import apiClient, { isGuest } from './apiClient';
import { getMockData, searchMockData } from './mockService';

const debounce = (func, delay) => {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
};

const getTypes = async (userData, setTypesData) => {
    if (isGuest()) return setTypesData(getMockData('types'));
    try {
        const response = await apiClient.get(`/${userData.user_name}/types`);
        setTypesData(Array.isArray(response.data) ? response.data : []);
    } catch (e) { alert("Error fetching types."); }
};

const searchType = async (userData, query, setTypesData) => {
    if (isGuest()) return setTypesData(searchMockData('types', query));
    try {
        const response = await apiClient.get(`/${userData.user_name}/${query}`);
        setTypesData(Array.isArray(response.data) ? response.data : []);
    } catch (e) {}
};

const getSupplies = async (userData, setSuppliesData) => {
    if (isGuest()) return setSuppliesData(getMockData('supplies'));
    try {
        const response = await apiClient.get(`/${userData.user_name}/supplies/`);
        setSuppliesData(Array.isArray(response.data) ? response.data : []);
    } catch (e) { alert("Error fetching supplies."); }
};

const searchBy_only_Supplies = async (userData, query, setSuppliesData) => {
    if (isGuest()) return setSuppliesData(searchMockData('supplies', query));
    try {
        const response = await apiClient.get(`/${userData.user_name}/search-supplies/${query}`);
        setSuppliesData(Array.isArray(response.data.supplies) ? response.data.supplies : []);
    } catch (e) {}
};

const getReciepts = async (userData, setRecieptsData) => {
    if (isGuest()) return setRecieptsData(getMockData('reciepts'));
    try {
        const response = await apiClient.get(`/${userData.user_name}/buy-supplies/`);
        setRecieptsData(Array.isArray(response.data) ? response.data : []);
    } catch (e) { alert("Error fetching reciepts."); }
};

const search_Reciepts = async (userData, query, setRecieptsData) => {
    if (isGuest()) return setRecieptsData(searchMockData('reciepts', query));
    try {
        const response = await apiClient.get(`/${userData.user_name}/search_reciepts/${query}`);
        setRecieptsData(Array.isArray(response.data.reciepts) ? response.data.reciepts : []);
    } catch (e) {}
};

const getEmployee = async (userData, setEmployeeData) => {
    if (isGuest()) return setEmployeeData(getMockData('employees'));
    try {
        const response = await apiClient.get(`/${userData.user_name}/employ-employees/`);
        setEmployeeData(Array.isArray(response.data) ? response.data : []);
    } catch (e) { alert("Error fetching employees."); }
};

const searchEmployee = async (userData, query, setEmployeeData) => {
    if (isGuest()) return setEmployeeData(searchMockData('employees', query));
    try {
        const response = await apiClient.get(`/${userData.user_name}/search-employees/${query}`);
        setEmployeeData(Array.isArray(response.data) ? response.data : []);
    } catch (e) {}
};

const getCustomers = async (userData, setCustomerData) => {
    if (isGuest()) return setCustomerData(getMockData('customers'));
    try {
        const response = await apiClient.get(`/${userData.user_name}/manage-customers/`);
        setCustomerData(Array.isArray(response.data) ? response.data : []);
    } catch (e) { alert("Error fetching customers."); }
};

const searchCustomer = async (userData, query, setCustomerData) => {
    if (isGuest()) return setCustomerData(searchMockData('customers', query));
    try {
        const response = await apiClient.get(`/${userData.user_name}/search-customers/${query}/`);
        setCustomerData(Array.isArray(response.data) ? response.data : []);
    } catch (e) {}
};

const getIncome = async (userData, setIncomeData) => {
    if (isGuest()) return setIncomeData(getMockData('income'));
    try {
        const response = await apiClient.get(`/${userData.user_name}/manage-income/`);
        setIncomeData(Array.isArray(response.data) ? response.data : []);
    } catch (e) { alert("Error fetching income."); }
};

const searchIncome = async (userData, query, setIncomeData) => {
    if (isGuest()) return setIncomeData(searchMockData('income', query));
    try {
        const response = await apiClient.get(`/${userData.user_name}/search-income/${query}/`);
        setIncomeData(Array.isArray(response.data) ? response.data : []);
    } catch (e) {}
};

const getPayment = async (userData, setPaymentData) => {
    if (isGuest()) return setPaymentData(getMockData('payment'));
    try {
        const response = await apiClient.get(`/${userData.user_name}/manage-payment/`);
        setPaymentData(Array.isArray(response.data) ? response.data : []);
    } catch (e) { alert("Error fetching payments."); }
};

const searchPayment = async (userData, query, setPaymentData) => {
    if (isGuest()) return setPaymentData(searchMockData('payment', query));
    try {
        const response = await apiClient.get(`/${userData.user_name}/search-payment/${query}/`);
        setPaymentData(Array.isArray(response.data) ? response.data : []);
    } catch (e) {}
};

const getCustomerSell = async (userData, setCustomerSellData) => {
    if (isGuest()) return setCustomerSellData(getMockData('customer_sells'));
    try {
        const response = await apiClient.get(`/${userData.user_name}/sell-customer/`);
        setCustomerSellData(Array.isArray(response.data) ? response.data : []);
    } catch (e) { alert("Error fetching customer sells."); }
};

const search_CustomerSells = async (userData, query, setCustomerSellData) => {
    if (isGuest()) return setCustomerSellData(searchMockData('customer_sells', query));
    try {
        const response = await apiClient.get(`/${userData.user_name}/search-customer-sell/${query}/`);
        setCustomerSellData(Array.isArray(response.data.customerSell) ? response.data.customerSell : []);
    } catch (e) {}
};

const getSell = async (userData, setSellData) => {
    if (isGuest()) return setSellData(getMockData('sells'));
    try {
        const response = await apiClient.get(`/${userData.user_name}/sell-supplies/`);
        setSellData(Array.isArray(response.data) ? response.data : []);
    } catch (e) { alert("Error fetching sells."); }
};

const search_sell = async (userData, query, setSellData) => {
    if (isGuest()) return setSellData(searchMockData('sells', query));
    try {
        const response = await apiClient.get(`/${userData.user_name}/search-sell/${query}`);
        setSellData(Array.isArray(response.data.sells) ? response.data.sells : []);
    } catch (e) {}
};

const getDispatches = async (userData,setDispatchesData) => {
    if (isGuest()) return setDispatchesData(getMockData('dispatched'));
    try {
        const response = await apiClient.get(`/${userData.user_name}/dispatch-supplies/`);
        setDispatchesData(Array.isArray(response.data) ? response.data : []);
    } catch (e) { alert("Error fetching dispatches."); }
};

const search_dispatched = async (userData, query, setDispatchedData) => {
    if (isGuest()) return setDispatchedData(searchMockData('dispatched', query));
    try {
        const response = await apiClient.get(`/${userData.user_name}/search-dispatched/${query}`);
        setDispatchedData(Array.isArray(response.data.dispatched) ? response.data.dispatched : []);
    } catch (e) {}
};

const getInventories = async (userData,setInventoryData) => {
    if (isGuest()) return setInventoryData(getMockData('supplies'));
    try {
        const response = await apiClient.get(`/${userData.user_name}/generate-inventory/`);
        setInventoryData(Array.isArray(response.data) ? response.data : []);
    } catch (e) { alert("Error fetching inventories."); }
};

const search_inventory = async (userData, query, setInventoryData) => {
    if (isGuest()) return setInventoryData(searchMockData('supplies', query));
    try {
        const response = await apiClient.get(`/${userData.user_name}/search-inventory/${query}`);
        setInventoryData(Array.isArray(response.data.dispatched) ? response.data.dispatched : []);
    } catch (e) {}
};

const searchBy_Supplies_Types = async (userData, query, setSuppliesData, setTypesData) => {
    if (isGuest()) {
        setSuppliesData(searchMockData('supplies', query));
        setTypesData(searchMockData('types', query));
        return;
    }
    try {
        const response = await apiClient.get(`/${userData.user_name}/search/${query}`);
        setSuppliesData(Array.isArray(response.data.supplies) ? response.data.supplies : []);
        setTypesData(Array.isArray(response.data.types) ? response.data.types : []);
    } catch (e) {}
};

const searchBy_Supplies = async (userData, query, type, setSuppliesData) => {
    if (isGuest()) return setSuppliesData(searchMockData('supplies', query));
    try {
        const response = await apiClient.get(`/${userData.user_name}/search-supplies/${type}/${query}`);
        setSuppliesData(Array.isArray(response.data.supplies) ? response.data.supplies : []);
    } catch (e) {}
};

export {
    getTypes, debounce, searchType, getSupplies, searchBy_only_Supplies, getReciepts, search_Reciepts,
    getEmployee, searchEmployee, getCustomers, searchCustomer, getIncome, searchIncome, getPayment,
    searchPayment, getCustomerSell, search_CustomerSells, getSell, search_sell, getDispatches,
    search_dispatched, getInventories, search_inventory, searchBy_Supplies_Types, searchBy_Supplies
};
