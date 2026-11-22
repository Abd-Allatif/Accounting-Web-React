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

function Supplies() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suppliesData, setSuppliesData] = useState([]);
  const [typesData, setTypesData] = useState([]);
  const [supplyName, setSupplyName] = useState('');
  const [unit, setUnit] = useState('unit');
  const [type, setType] = useState('');
  const [countity, setCountity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const username = user?.user_name || 'guest';

  const fetchSupplies = async () => {
    if (isGuest()) {
      setSuppliesData([
        { id: 1, supply_name: 'Supply 1', type: 'Electronics', unit: 'kg', countity: 100, buy_price: 5, sell_price: 10 },
        { id: 2, supply_name: 'Supply 2', type: 'Clothing', unit: 'pcs', countity: 50, buy_price: 12, sell_price: 20 },
      ]);
      setTypesData([{ id: 1, type: 'Electronics' }, { id: 2, type: 'Clothing' }]);
      return;
    }
    setLoading(true);
    try {
      const [supRes, typesRes] = await Promise.all([
        apiClient.get(`/${username}/supplies/`),
        apiClient.get(`/${username}/types`),
      ]);
      setSuppliesData(Array.isArray(supRes.data) ? supRes.data : []);
      setTypesData(Array.isArray(typesRes.data) ? typesRes.data : []);
    } catch {
      setError('Failed to load supplies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSupplies(); }, [username]);

  const sendData = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!supplyName || !type || !unit || !countity || !buyPrice || !sellPrice) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    if (isGuest()) {
      setSuppliesData([...suppliesData, { id: Date.now(), supply_name: supplyName, type, unit, countity: Number(countity), buy_price: Number(buyPrice), sell_price: Number(sellPrice) }]);
      setSupplyName(''); setType(''); setCountity(''); setBuyPrice(''); setSellPrice('');
      setSuccess('Supply added (demo)');
      setLoading(false);
      return;
    }
    try {
      await apiClient.post(`/${username}/manage-supplies/`, {
        user: username, supply_name: supplyName, type, unit,
        countity: parseFloat(countity) || 0, buy_price: parseFloat(buyPrice) || 0, sell_price: parseFloat(sellPrice) || 0,
      });
      setSupplyName(''); setType(''); setCountity(''); setBuyPrice(''); setSellPrice('');
      setSuccess('Supply added successfully');
      fetchSupplies();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add supply');
    } finally {
      setLoading(false);
    }
  };

  const saveSupply = async (key) => {
    setLoading(true);
    if (isGuest()) {
      setSuppliesData(suppliesData.map((s) => (s.id === key || s.supply_name === key ? { ...s, ...editValue } : s)));
      setEditId(null); setEditValue({});
      setLoading(false);
      return;
    }
    try {
      await apiClient.put(`/${username}/edit-supplies/`, {
        old_supply: key, ...editValue,
      });
      setEditId(null); setEditValue({});
      setSuccess('Supply updated successfully');
      fetchSupplies();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update supply');
    } finally {
      setLoading(false);
    }
  };

  const deleteSupply = async (key) => {
    if (!window.confirm('Are you sure you want to delete this supply?')) return;
    setLoading(true);
    if (isGuest()) {
      setSuppliesData(suppliesData.filter((s) => s.id !== key && s.supply_name !== key));
      setLoading(false);
      return;
    }
    try {
      await apiClient.delete(`/${username}/edit-supplies/`, { data: { supply: key } });
      setSuccess('Supply deleted successfully');
      fetchSupplies();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete supply');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredSupplies = suppliesData.filter((s) =>
    s.supply_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <PageWrapper>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar
        title={t('supplies')}
        onMenuClick={() => setSidebarOpen(true)}
        showBack
        backLabel={t('back')}
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 lg:w-[420px]">
          <h3 className="text-lg font-semibold text-text-primary mb-4">{t('addSupply')}</h3>
          {error && <Alert variant="error" className="mb-3">{error}</Alert>}
          {success && <Alert variant="success" className="mb-3">{success}</Alert>}
          <form className="space-y-3" onSubmit={sendData}>
            <Input
              label={t('supply')}
              type="text"
              value={supplyName}
              onChange={(e) => setSupplyName(e.target.value)}
              placeholder="Supply name"
              required
            />
            <Input
              label={t('type')}
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Type name"
              required
            />
            <div className="space-y-2">
              <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider">{t('unit')}</label>
              <select
                className="w-full rounded-sm border border-border bg-bg-input px-3 py-2 text-text-primary focus:outline-none focus:border-brand-accent"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                <option value="unit">Unit</option>
                <option value="kg">kg</option>
                <option value="m">m</option>
                <option value="pcs">pcs</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={t('countity')}
                type="number"
                value={countity}
                onChange={(e) => setCountity(e.target.value)}
                placeholder="0"
                required
              />
              <Input
                label={t('buyPrice')}
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <Input
              label={t('sellPrice')}
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              placeholder="0.00"
              required
            />
            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              {t('addSupply')}
            </Button>
          </form>
        </Card>

        <Card className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">{t('suppliesList')}</h3>
            <Input
              label=""
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
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
                  <TableHead>{t('type')}</TableHead>
                  <TableHead>{t('unit')}</TableHead>
                  <TableHead>{t('countity')}</TableHead>
                  <TableHead>{t('buyPrice')}</TableHead>
                  <TableHead>{t('sellPrice')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSupplies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-text-muted py-4">
                      No supplies found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSupplies.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        {editId === s.id ? (
                          <Input
                            type="text"
                            value={editValue.supply_name || s.supply_name}
                            onChange={(e) => setEditValue({ ...editValue, supply_name: e.target.value })}
                            className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                          />
                        ) : (
                          s.supply_name
                        )}
                      </TableCell>
                      <TableCell>{s.type || '-'}</TableCell>
                      <TableCell>{s.unit}</TableCell>
                      <TableCell>{s.countity}</TableCell>
                      <TableCell>{s.buy_price}</TableCell>
                      <TableCell>{s.sell_price}</TableCell>
                      <TableCell className="flex gap-2">
                        {editId === s.id ? (
                          <>
                            <Button variant="success" size="sm" onClick={() => saveSupply(s.supply_name || s.id)} loading={loading}>
                              {t('save')}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { setEditId(null); setEditValue({}); }}>
                              {t('cancel')}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" onClick={() => { setEditId(s.id); setEditValue({ ...s }); }}>
                              {t('edit')}
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => deleteSupply(s.supply_name || s.id)}>
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
        </Card>
      </div>
    </PageWrapper>
  );
}

export default Supplies;
