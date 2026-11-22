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

function Customers() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [customer, setCustomer] = useState('');
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const username = user?.user_name || 'guest';

  const fetchCustomers = async () => {
    if (isGuest()) {
      setCustomerData([
        { id: 1, customer_name: 'Guest Customer', total_debt: 500 },
        { id: 2, customer_name: 'John Doe', total_debt: 250 },
      ]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(`/${username}/manage-customers/`);
      setCustomerData(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, [username]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const sendData = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!customer.trim()) {
      setError('Customer name is required');
      return;
    }
    setLoading(true);
    if (isGuest()) {
      setCustomerData([...customerData, { id: Date.now(), customer_name: customer, total_debt: 0 }]);
      setCustomer('');
      setSuccess('Customer added (demo)');
      setLoading(false);
      return;
    }
    try {
      await apiClient.post(`/${username}/manage-customers/`, { user: username, customer });
      setCustomer('');
      setSuccess('Customer added successfully');
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add customer');
    } finally {
      setLoading(false);
    }
  };

  const editCustomer = async (key) => {
    if (!editValue.trim()) {
      setError('Customer name is required');
      return;
    }
    setLoading(true);
    if (isGuest()) {
      setCustomerData(customerData.map((c) => (c.id === key || c.customer_name === key ? { ...c, customer_name: editValue } : c)));
      setEditId(null); setEditValue('');
      setLoading(false);
      return;
    }
    try {
      await apiClient.put(`/${username}/edit-customers/`, { old_customer: key, new_customer: editValue });
      setEditId(null); setEditValue('');
      setSuccess('Customer updated successfully');
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (key) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    setLoading(true);
    if (isGuest()) {
      setCustomerData(customerData.filter((c) => c.id !== key && c.customer_name !== key));
      setLoading(false);
      return;
    }
    try {
      await apiClient.delete(`/${username}/edit-customers/`, { data: { customer: key } });
      setSuccess('Customer deleted successfully');
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete customer');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customerData.filter((c) =>
    c.customer_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <PageWrapper>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar
        title={t('customers')}
        onMenuClick={() => setSidebarOpen(true)}
        showBack
        backLabel={t('back')}
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 lg:w-[420px]">
          <h3 className="text-lg font-semibold text-text-primary mb-4">{t('addCustomer')}</h3>
          {error && <Alert variant="error" className="mb-3">{error}</Alert>}
          {success && <Alert variant="success" className="mb-3">{success}</Alert>}
          <form className="space-y-3" onSubmit={sendData}>
            <Input
              label={t('customer')}
              type="text"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Customer name"
              required
            />
            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              {t('addCustomer')}
            </Button>
          </form>
        </Card>

        <Card className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">{t('customersList')}</h3>
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
                  <TableHead>{t('customer')}</TableHead>
                  <TableHead>{t('totalDebt')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-text-muted py-4">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        {editId === c.id ? (
                          <Input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                          />
                        ) : (
                          c.customer_name
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{c.total_debt || 0}</TableCell>
                      <TableCell className="flex gap-2">
                        {editId === c.id ? (
                          <>
                            <Button variant="success" size="sm" onClick={() => editCustomer(c.customer_name)} loading={loading}>
                              {t('save')}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { setEditId(null); setEditValue(''); }}>
                              {t('cancel')}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" onClick={() => { setEditId(c.id); setEditValue(c.customer_name); }}>
                              {t('edit')}
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => deleteCustomer(c.customer_name)}>
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

export default Customers;
