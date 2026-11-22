import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import apiClient, { isGuest } from '../../services/apiClient';
import { Sidebar } from '../../components/layout/Sidebar';
import { TopBar } from '../../components/layout/TopBar';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Alert } from '../../components/ui/Alert';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

function CustomerSells() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchCustomers, setSearchCustomers] = useState('');
  const [customerData, setCustomerData] = useState([]);
  const [searchSupplies, setSearchSupplies] = useState('');
  const [suppliesData, setSuppliesData] = useState([]);
  const [countity, setCountity] = useState('');
  const [price, setPrice] = useState('');
  const [debt, setDebt] = useState('');
  const [paid, setPaid] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [sellData, setSellData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [editSellId, setEditSellId] = useState(null);
  const [editsellData, setEditsellData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const username = user?.user_name || 'guest';

  const fetchCustomerSell = async () => {
    if (isGuest()) {
      setSellData([
        { id: 1, customer_name: 'Guest Customer', supply: 'Supply 1', countity: 1, price: 10, total: 10, debt: 5, paid: 5, date_of_buying: '2023-01-01', notes: 'Demo' },
      ]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(`/${username}/sell-customer/`);
      setSellData(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load customer sells');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomerSell(); }, [username]);

  const searchForCustomer = useCallback(async (q = '') => {
    if (!q) { setCustomerData([]); return; }
    try {
      const res = await apiClient.get(`/${username}/search-customers/${q}/`);
      setCustomerData(Array.isArray(res.data) ? res.data : []);
    } catch {
      setCustomerData([]);
    }
  }, [username]);

  const searchForSupplies = useCallback(async (q = '') => {
    if (!q) { setSuppliesData([]); return; }
    try {
      const res = await apiClient.get(`/${username}/search-supplies/${q}`);
      setSuppliesData(Array.isArray(res.data.supplies) ? res.data.supplies : []);
    } catch {
      setSuppliesData([]);
    }
  }, [username]);

  const handleSearchCustomers = (e) => {
    const q = e.target.value;
    setSearchCustomers(q);
    searchForCustomer(q);
    if (!q) setCustomerData([]);
  };

  const handleSearchSupplies = (e) => {
    const q = e.target.value;
    setSearchSupplies(q);
    searchForSupplies(q);
    if (!q) setSuppliesData([]);
  };

  const sendData = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!searchCustomers || !searchSupplies || !countity || !price || !debt || !paid || !date) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    if (isGuest()) {
      setSellData([...sellData, { id: Date.now(), customer_name: searchCustomers, supply: searchSupplies, countity, price, debt, paid, total: Number(countity) * Number(price), date_of_buying: date, notes }]);
      setSearchCustomers(''); setSearchSupplies(''); setCountity(''); setPrice(''); setDebt(''); setPaid(''); setDate(''); setNotes('');
      setSuccess('Customer sell added (demo)');
      fetchCustomerSell();
      setLoading(false);
      return;
    }
    try {
      await apiClient.post(`/${username}/sell-customer/`, {
        user: username, customer_name: searchCustomers, date_of_buying: date, supply: searchSupplies,
        price, countity, debt, paid, notes,
      });
      setSearchCustomers(''); setSearchSupplies(''); setCountity(''); setPrice(''); setDebt(''); setPaid(''); setDate(''); setNotes('');
      setSuccess('Customer sell recorded successfully');
      fetchCustomerSell();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to record customer sell');
    } finally {
      setLoading(false);
    }
  };

  const editCustomerSell = async (id) => {
    setLoading(true);
    if (isGuest()) {
      setSellData(sellData.map((s) => (s.id === id ? { ...s, ...editsellData, total: Number(editsellData.countity) * Number(editsellData.price) } : s)));
      setEditSellId(null);
      fetchCustomerSell();
      setLoading(false);
      return;
    }
    try {
      await apiClient.put(`/${username}/edit-customer-sell/`, { ...editsellData });
      setEditSellId(null);
      fetchCustomerSell();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to edit customer sell');
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomerSell = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer sell record?')) return;
    setLoading(true);
    if (isGuest()) {
      setSellData(sellData.filter((s) => s.id !== id));
      setLoading(false);
      return;
    }
    try {
      await apiClient.delete(`/${username}/edit-customer-sell/`, { data: { id } });
      setSuccess('Customer sell deleted successfully');
      fetchCustomerSell();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete customer sell');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar
        title={t('sellCustomer')}
        onMenuClick={() => setSidebarOpen(true)}
        showBack
        backLabel={t('back')}
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 lg:w-[560px]">
          <h3 className="text-lg font-semibold text-text-primary mb-4">{t('recordCustomerSell')}</h3>
          {error && <Alert variant="error" className="mb-3">{error}</Alert>}
          {success && <Alert variant="success" className="mb-3">{success}</Alert>}
          <form className="space-y-3" onSubmit={sendData}>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Input
                  label={t('customer')}
                  type="text"
                  value={searchCustomers}
                  onChange={handleSearchCustomers}
                  placeholder="Customer name"
                  required
                />
                {searchCustomers && customerData.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 rounded-lg border border-border bg-card shadow-lg max-h-48 overflow-y-auto">
                    {customerData.map((c, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-bg-hover border-b border-border/50 last:border-0"
                        onClick={() => { setSearchCustomers(c.customer_name); setCustomerData([]); }}
                      >
                        {c.customer_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <Input
                  label={t('supply')}
                  type="text"
                  value={searchSupplies}
                  onChange={handleSearchSupplies}
                  placeholder="Supply name"
                  required
                />
                {searchSupplies && suppliesData.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 rounded-lg border border-border bg-card shadow-lg max-h-48 overflow-y-auto">
                    {suppliesData.map((s, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 text-sm cursor-pointer hover:bg-bg-hover border-b border-border/50 last:border-0"
                        onClick={() => { setSearchSupplies(s.supply_name); setPrice(s.sell_price); setCountity('1'); setSuppliesData([]); }}
                      >
                        {s.supply_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input label={t('countity')} type="number" value={countity} onChange={(e) => setCountity(e.target.value)} required />
              <Input label={t('price')} type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
              <Input label={t('debt')} type="number" value={debt} onChange={(e) => setDebt(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label={t('paid')} type="number" value={paid} onChange={(e) => setPaid(e.target.value)} required />
              <Input label={t('date')} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <Input label={t('notes')} type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              {t('sellCustomerbtn')}
            </Button>
          </form>
        </Card>

        <Card className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <button
              className="flex items-center gap-2 text-sm font-medium text-brand-accent hover:text-brand-accent-light"
              onClick={() => setShowTable(!showTable)}
            >
              {showTable ? t('hideData') : t('showData')} <span className="text-text-secondary">{t('sellCustomer')}</span>
            </button>
          </div>
          {showTable && (
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('customer')}</TableHead>
                    <TableHead>{t('supply')}</TableHead>
                    <TableHead>{t('countity')}</TableHead>
                    <TableHead>{t('price')}</TableHead>
                    <TableHead>{t('total')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-text-muted py-4">
                        No customer sells found
                      </TableCell>
                    </TableRow>
                  ) : (
                    sellData.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell>{c.customer_name}</TableCell>
                        <TableCell>{c.supply}</TableCell>
                        <TableCell>
                          {editSellId === c.id ? (
                            <Input
                              type="number"
                              value={editsellData.countity || c.countity}
                              onChange={(e) => setEditsellData({ ...editsellData, countity: e.target.value })}
                              className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                            />
                          ) : (
                            c.countity
                          )}
                        </TableCell>
                        <TableCell>
                          {editSellId === c.id ? (
                            <Input
                              type="number"
                              value={editsellData.price || c.price}
                              onChange={(e) => setEditsellData({ ...editsellData, price: e.target.value })}
                              className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                            />
                          ) : (
                            c.price
                          )}
                        </TableCell>
                        <TableCell>{c.total}</TableCell>
                        <TableCell className="flex gap-2">
                          {editSellId === c.id ? (
                            <>
                              <Button variant="success" size="sm" onClick={() => editCustomerSell(c.id)} loading={loading}>
                                {t('save')}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => { setEditSellId(null); setEditsellData({}); }}>
                                {t('cancel')}
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="outline" size="sm" onClick={() => { setEditSellId(c.id); setEditsellData({ ...c }); }}>
                                {t('edit')}
                              </Button>
                              <Button variant="danger" size="sm" onClick={() => deleteCustomerSell(c.id)}>
                                {t('delete')}
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
}

export default CustomerSells;
