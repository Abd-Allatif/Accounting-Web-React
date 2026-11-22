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
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Alert } from '../../components/ui/Alert';

function Types() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typesData, setTypesData] = useState([]);
  const [type, setType] = useState('');
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const username = user?.user_name || 'guest';

  const fetchTypes = async () => {
    if (isGuest()) {
      setTypesData([{ id: 1, type: 'Electronics' }, { id: 2, type: 'Clothing' }]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(`/${username}/types`);
      setTypesData(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTypes(); }, [username]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const sendData = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!type.trim()) {
      setError('Type name is required');
      return;
    }
    setLoading(true);
    if (isGuest()) {
      setTypesData([...typesData, { id: Date.now(), type: type }]);
      setType('');
      setSuccess('Type added (demo)');
      setLoading(false);
      return;
    }
    try {
      await apiClient.post(`/${username}/types`, { type: type, user: username });
      setType('');
      setSuccess('Type added successfully');
      fetchTypes();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add type');
    } finally {
      setLoading(false);
    }
  };

  const updateType = async (key) => {
    if (!editValue.trim()) {
      setError('Type name is required');
      return;
    }
    setLoading(true);
    if (isGuest()) {
      setTypesData(typesData.map((t) => (t.id === key || t.type === key ? { ...t, type: editValue } : t)));
      setEditId(null);
      setEditValue('');
      setSuccess('Type updated (demo)');
      setLoading(false);
      return;
    }
    try {
      await apiClient.put(`/${username}/types_edit`, { old_type: key, new_type: editValue });
      setEditId(null);
      setEditValue('');
      setSuccess('Type updated successfully');
      fetchTypes();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update type');
    } finally {
      setLoading(false);
    }
  };

  const deleteType = async (key) => {
    if (!window.confirm('Are you sure you want to delete this type?')) return;
    setLoading(true);
    if (isGuest()) {
      setTypesData(typesData.filter((t) => t.id !== key && t.type !== key));
      setLoading(false);
      return;
    }
    try {
      await apiClient.delete(`/${username}/types_edit`, { data: { type: key } });
      setSuccess('Type deleted successfully');
      fetchTypes();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete type');
    } finally {
      setLoading(false);
    }
  };

  const filteredTypes = typesData.filter((t) =>
    t.type.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <PageWrapper>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar
        title={t('types')}
        onMenuClick={() => setSidebarOpen(true)}
        showBack
        backLabel={t('back')}
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 lg:w-96">
          <h3 className="text-lg font-semibold text-text-primary mb-4">{t('addType')}</h3>
          {error && <Alert variant="error" className="mb-3">{error}</Alert>}
          {success && <Alert variant="success" className="mb-3">{success}</Alert>}
          <form className="space-y-3" onSubmit={sendData}>
            <Input
              label={t('type')}
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Enter type name"
              required
            />
            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              {t('addType')}
            </Button>
          </form>
        </Card>

        <Card className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">{t('typesList')}</h3>
            <Input
              label=""
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('searchTypes')}
              className="w-48"
            />
          </div>
          {loading && <div className="flex justify-center py-4"><LoadingSpinner /></div>}
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('type')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-text-muted py-4">
                      No types found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTypes.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        {editId === t.id ? (
                          <Input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                          />
                        ) : (
                          t.type
                        )}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        {editId === t.id ? (
                          <>
                            <Button variant="success" size="sm" onClick={() => updateType(t.type)} loading={loading}>
                              {t('save')}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { setEditId(null); setEditValue(''); }}>
                              {t('cancel')}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" onClick={() => { setEditId(t.id); setEditValue(t.type); }}>
                              {t('edit')}
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => deleteType(t.type)}>
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

export default Types;
