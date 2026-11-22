import { parseMoney } from '../utils/helpers';

const STORAGE_KEY = 'accounting_fund';

const defaultFund = {
  permanant_fund: 0,
  sells_fund: 0,
};

export function getFund() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultFund };
    return { ...defaultFund, ...JSON.parse(raw) };
  } catch {
    return { ...defaultFund };
  }
}

export function saveFund(fund) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fund));
  return fund;
}

export function resetFund() {
  localStorage.removeItem(STORAGE_KEY);
  return { ...defaultFund };
}

export function addToPermanantFund(amount) {
  const fund = getFund();
  fund.permanant_fund = parseMoney(fund.permanant_fund) + parseMoney(amount);
  return saveFund(fund);
}

export function subtractFromPermanantFund(amount) {
  const fund = getFund();
  fund.permanant_fund = parseMoney(fund.permanant_fund) - parseMoney(amount);
  return saveFund(fund);
}

export function addToSellsFund(amount) {
  const fund = getFund();
  fund.sells_fund = parseMoney(fund.sells_fund) + parseMoney(amount);
  return saveFund(fund);
}

export function subtractFromSellsFund(amount) {
  const fund = getFund();
  fund.sells_fund = parseMoney(fund.sells_fund) - parseMoney(amount);
  return saveFund(fund);
}

export function moveSellsToPerma(amount) {
  const fund = getFund();
  if (parseMoney(fund.sells_fund) < parseMoney(amount)) {
    throw new Error('Insufficient sells fund');
  }
  fund.sells_fund = parseMoney(fund.sells_fund) - parseMoney(amount);
  fund.permanant_fund = parseMoney(fund.permanant_fund) + parseMoney(amount);
  return saveFund(fund);
}

export function updateBudget(oldBudget, newBudget) {
  const fund = getFund();
  fund.permanant_fund = parseMoney(fund.permanant_fund) - parseMoney(oldBudget) + parseMoney(newBudget);
  return saveFund(fund);
}

export default {
  getFund,
  saveFund,
  resetFund,
  addToPermanantFund,
  subtractFromPermanantFund,
  addToSellsFund,
  subtractFromSellsFund,
  moveSellsToPerma,
  updateBudget,
};
