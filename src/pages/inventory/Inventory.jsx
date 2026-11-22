import React, { useState, useEffect } from 'react';
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

function Inventory() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [supplyName, setSupplyName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suppliesData, setSuppliesData] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const username = user?.user_name || 'guest';

  const fetchInventory = async () => {
    if (isGuest()) {
      setInventoryData([
        { id: 1, supply: 'Supply 1', quantity: 10, unit_cost: 5, total_value: 50, generated_date: '2023-01-01' },
      ]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(`/${username}/generate-inventory/`);
      setInventoryData(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, [username]);

  const searchForSupplies = async (query) => {
    if (!query) { setSuppliesData([]); return; }
    try {
      const res = await apiClient.get(`/${username}/search-inventory/${query}`);
      const data = res.data.dispatched || [];
      setSuppliesData(data.map((i) => ({ supply_name: i.supply })));
    } catch {
      setSuppliesData([]);
    }
  };

  const handleSearchSupplies = (e) => {
    const q = e.target.value;
    setSupplyName(q);
    searchForSupplies(q);
    if (!q) setSuppliesData([]);
  };

  const sendData = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!supplyName || !startDate || !endDate) {
      setError('Supply, start date, and end date are required');
      return;
    }
    if (isGuest()) {
      setSuccess('Demo mode: inventory cannot be generated');
      return;
    }
    setLoading(true);
    try {
      await apiClient.post(`/${username}/generate-inventory/`, {
        user: username, supply: supplyName, start_date: startDate, end_date: endDate,
      });
      setSupplyName(''); setStartDate(''); setEndDate('');
      setSuccess('Inventory generated successfully');
      fetchInventory();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate inventory');
    } finally {
      setLoading(false);
    }
  };

  const deleteInventory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inventory record?')) return;
    if (isGuest()) {
      setSuccess('Demo mode: data cannot be deleted');
      return;
    }
    setLoading(true);
    try {
      await apiClient.delete(`/${username}/delete-inventory/`, { data: { id } });
      setSuccess('Inventory deleted successfully');
      fetchInventory();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete inventory');
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventoryData.filter((inv) =>
    inv.supply.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <PageWrapper>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar
        title={t('inventory')}
        onMenuClick={() => setSidebarOpen(true)}
        showBack
        backLabel={t('back')}
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 lg:w-[480px]">
          <h3 className="text-lg font-semibold text-text-primary mb-4">{t('generateInventory')}</h3>
          {error && <Alert variant="error" className="mb-3">{error}</Alert>}
          {success && <Alert variant="success" className="mb-3">{success}</Alert>}
          <form className="space-y-3" onSubmit={sendData}>
            <div className="relative">
              <Input
                label={t('supply')}
                type="text"
                value={supplyName}
                onChange={handleSearchSupplies}
                placeholder="Search supplies"
                required
              />
              {supplyName && suppliesData.length > 0 && (
                <div className="absolute z-10 w-full mt-1 rounded-lg border border-border bg-card shadow-lg max-h-48 overflow-y-auto">
                  {suppliesData.map((s, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-bg-hover border-b border-border/50 last:border-0"
                      onClick={() => { setSupplyName(s.supply_name); setSuppliesData([]); }}
                    >
                      {s.supply_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label={t('startDate')} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              <Input label={t('endDate')} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>
            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              {t('generateInventory')}
            </Button>
          </form>
        </Card>

        <Card className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">{t('inventoryList')}</h3>
            <Input
              label=""
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search')}
              className="w-48"
            />
          </div>
          {loading && <div className="flex justify-center py-4"><LoadingSpinner /></div>}
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('supply')}</TableHead>
                  <TableHead>{t('quantity')}</TableHead>
                  <TableHead>{t('unitCost')}</TableHead>
                  <TableHead>{t('totalValue')}</TableHead>
                  <TableHead>{t('date')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-text-muted py-4">
                      No inventory records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>{inv.supply}</TableCell>
                      <TableCell>{inv.quantity}</TableCell>
                      <TableCell>{inv.unit_cost}</TableCell>
                      <TableCell>{inv.total_value}</TableCell>
                      <TableCell>{inv.generated_date}</TableCell>
                      <TableCell>
                        <Button variant="danger" size="sm" onClick={() => deleteInventory(inv.id)}>
                          {t('delete')}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </PageWrapper>
  );
}

export default Inventory;
