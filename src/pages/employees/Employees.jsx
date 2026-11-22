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

function Employees() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [salary, setSalary] = useState('');
  const [empDate, setEmpDate] = useState('');
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState({ name: '', salary: '', date: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const username = user?.user_name || 'guest';

  const fetchEmployees = async () => {
    if (isGuest()) {
      setEmployeeData([
        { id: 1, employee_name: 'Guest Employee', salary: 1000, date_of_employment: '2023-01-01' },
      ]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.get(`/${username}/employ-employees/`);
      setEmployeeData(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, [username]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const sendData = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!employeeName || !salary || !empDate) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    if (isGuest()) {
      setEmployeeData([...employeeData, { id: Date.now(), employee_name: employeeName, salary, date_of_employment: empDate }]);
      setEmployeeName(''); setSalary(''); setEmpDate('');
      setSuccess('Employee added (demo)');
      setLoading(false);
      return;
    }
    try {
      await apiClient.post(`/${username}/employ-employees/`, {
        user: username, employee_name: employeeName, salary: parseFloat(salary) || 0, date_of_employment: empDate,
      });
      setEmployeeName(''); setSalary(''); setEmpDate('');
      setSuccess('Employee added successfully');
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  const editEmployee = async (key) => {
    if (!editValue.name || !editValue.salary || !editValue.date) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    if (isGuest()) {
      setEmployeeData(employeeData.map((e) => (e.id === key || e.employee_name === key ? { ...e, ...editValue } : e)));
      setEditId(null); setEditValue({ name: '', salary: '', date: '' });
      setLoading(false);
      return;
    }
    try {
      await apiClient.put(`/${username}/edit-employees/`, {
        old_employee: key, new_employee: editValue.name, new_salary: editValue.salary, new_date: editValue.date,
      });
      setEditId(null); setEditValue({ name: '', salary: '', date: '' });
      setSuccess('Employee updated successfully');
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update employee');
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (key) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    setLoading(true);
    if (isGuest()) {
      setEmployeeData(employeeData.filter((e) => e.id !== key && e.employee_name !== key));
      setLoading(false);
      return;
    }
    try {
      await apiClient.delete(`/${username}/edit-employees/`, { data: { employee: key } });
      setSuccess('Employee deleted successfully');
      fetchEmployees();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete employee');
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employeeData.filter((e) =>
    e.employee_name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <PageWrapper>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <TopBar
        title={t('employees')}
        onMenuClick={() => setSidebarOpen(true)}
        showBack
        backLabel={t('back')}
      />
      <div className="flex flex-col lg:flex-row gap-6">
        <Card className="flex-1 lg:w-[420px]">
          <h3 className="text-lg font-semibold text-text-primary mb-4">{t('employ')}</h3>
          {error && <Alert variant="error" className="mb-3">{error}</Alert>}
          {success && <Alert variant="success" className="mb-3">{success}</Alert>}
          <form className="space-y-3" onSubmit={sendData}>
            <Input
              label={t('employeeName')}
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              placeholder="Employee name"
              required
            />
            <Input
              label={t('salary')}
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="0.00"
              required
            />
            <Input label={t('date')} type="date" value={empDate} onChange={(e) => setEmpDate(e.target.value)} required />
            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              {t('employ')}
            </Button>
          </form>
        </Card>

        <Card className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">{t('employeesList')}</h3>
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
                  <TableHead>{t('employeeName')}</TableHead>
                  <TableHead>{t('date')}</TableHead>
                  <TableHead>{t('salary')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-text-muted py-4">
                      No employees found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>
                        {editId === e.id ? (
                          <Input
                            type="text"
                            value={editValue.name}
                            onChange={(ev) => setEditValue({ ...editValue, name: ev.target.value })}
                            className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                          />
                        ) : (
                          e.employee_name
                        )}
                      </TableCell>
                      <TableCell>
                        {editId === e.id ? (
                          <Input
                            type="date"
                            value={editValue.date}
                            onChange={(ev) => setEditValue({ ...editValue, date: ev.target.value })}
                            className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                          />
                        ) : (
                          e.date_of_employment
                        )}
                      </TableCell>
                      <TableCell>
                        {editId === e.id ? (
                          <Input
                            type="text"
                            value={editValue.salary}
                            onChange={(ev) => setEditValue({ ...editValue, salary: ev.target.value })}
                            className="w-full text-sm bg-transparent border-none focus:ring-0 p-0"
                          />
                        ) : (
                          e.salary
                        )}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        {editId === e.id ? (
                          <>
                            <Button variant="success" size="sm" onClick={() => editEmployee(e.employee_name)} loading={loading}>
                              {t('save')}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => { setEditId(null); setEditValue({ name: '', salary: '', date: '' }); }}>
                              {t('cancel')}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" onClick={() => {
                              setEditId(e.id);
                              setEditValue({ name: e.employee_name, salary: e.salary, date: e.date_of_employment });
                            }}>
                              {t('edit')}
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => deleteEmployee(e.employee_name)}>
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

export default Employees;
