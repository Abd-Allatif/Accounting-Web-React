import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { isGuest } from '../../services/apiClient';
import { getEmployee, debounce, searchEmployee } from '../../services/BackendServices';
import { addMockData, updateMockData, deleteMockData } from '../../services/mockService';
import { BackGround, Card, InputField, Button, SearchField, TopBar, Drawer, Loader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components';
import { useTranslation } from 'react-i18next';

function Employee() {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeName, setEmployeeName] = useState('');
  const [salary, setSalary] = useState('');
  const [empDate, setEmpDate] = useState('');
  const [employeeAdded, setEmployeeAdded] = useState('');
  const [editEmployeeID, seteditEmployeeID] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editSalary, setEditSalary] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user_data'));

  const fetchEmployees = () => getEmployee(userData, setEmployeeData);
  useEffect(() => { fetchEmployees(); }, []);

  const searchfetchEmployees = async (query = '') => searchEmployee(userData, query, setEmployeeData);
  const debouncedFetchEmployees = useCallback(debounce(searchfetchEmployees, 300), []);
  const handleSearchChange = (event) => { const q = event.target.value; setSearchQuery(q); debouncedFetchEmployees(q); };

  const send_data = async (event) => {
    event.preventDefault();
    if (!employeeName || !salary || !empDate) return alert(t('null_err_employee'));
    setLoading(true);
    if (isGuest()) {
      addMockData('employees', { employee_name: employeeName, salary, date_of_employment: empDate, job_title: 'N/A' });
      setEmployeeAdded(`${employeeName} added successfully`); setEmployeeName(''); setSalary(''); setEmpDate(''); fetchEmployees(); setLoading(false); return;
    }
    try {
      await apiClient.post(`/${userData.user_name}/employ-employees/`, { user: userData.user_name, employee_name: employeeName, salary, date_of_employment: empDate });
      setEmployeeAdded(`${employeeName} added successfully`); setEmployeeName(''); setSalary(''); setEmpDate(''); fetchEmployees();
    } catch { alert('Error adding employee.'); } finally { setLoading(false); }
  };

  const editEmployee = async (employeeKey) => {
    if (!editName || !editSalary || !editDate) return alert(t('null_err_employee'));
    if (isGuest()) { updateMockData('employees', employeeKey, { employee_name: editName, salary: editSalary, date_of_employment: editDate }); seteditEmployeeID(null); fetchEmployees(); return; }
    try {
      await apiClient.put(`/${userData.user_name}/edit-employees/`, { old_employee: employeeKey, new_employee: editName, new_salary: editSalary, new_date: editDate });
      fetchEmployees(); seteditEmployeeID(null);
    } catch { alert('Error editing employee.'); }
  };

  const deleteEmployee = async (employeeKey) => {
    if (isGuest()) { deleteMockData('employees', employeeKey); fetchEmployees(); return; }
    try { await apiClient.delete(`/${userData.user_name}/edit-employees/`, { data: { employee: employeeKey } }); fetchEmployees(); } catch { alert('Error deleting employee.'); }
  };

  return (
    <StyledWrapper>
      <BackGround className="Container">
        <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate('/main')} Text={t('employees')} />
        <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
        <Card className="ItemsContainer">
          <div className="Row">
            <InputField placeholder={t('employeeName')} type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
            <InputField placeholder={t('salary')} type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
          </div>
          <div className="Row"><InputField type="date" value={empDate} onChange={(e) => setEmpDate(e.target.value)} /></div>
          {employeeAdded && <div className="SuccessMsg">{employeeAdded}</div>}
          <div className="Row"><Button onClick={send_data}>{t('employ')}</Button></div>
          {loading && <div className="LoaderRow"><Loader width="3" height="20" animateHeight="36" /></div>}
        </Card>
        <footer className="PageFooter"><Button onClick={() => setShowTable(!showTable)}>{t('showdata')}</Button></footer>
        {showTable && (
          <div className="dataScreen">
            <div className="dataScreenHeader">
              <h3 className="dataScreenTitle">{t('employees')}</h3>
              <Button className="ghost" onClick={() => setShowTable(false)}>{t('close')}</Button>
            </div>
            <SearchField onClick={fetchEmployees} value={searchQuery} onChange={handleSearchChange} />
            <Table>
              <TableHeader><TableRow>
                <TableHead>{t('employees')}</TableHead><TableHead>{t('date')}</TableHead>
                <TableHead>{t('salary')}</TableHead><TableHead>{t('actions')}</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {employeeData.map((e, i) => (
                  <TableRow key={i}>
                    <TableCell>{editEmployeeID === e.employee_name ? <InputField type="text" value={editName} onChange={(ev) => setEditName(ev.target.value)} /> : e.employee_name}</TableCell>
                    <TableCell>{editEmployeeID === e.employee_name ? <InputField type="date" value={editDate} onChange={(ev) => setEditDate(ev.target.value)} /> : e.date_of_employment}</TableCell>
                    <TableCell>{editEmployeeID === e.employee_name ? <InputField type="text" value={editSalary} onChange={(ev) => setEditSalary(ev.target.value)} /> : e.salary}</TableCell>
                    <TableCell>
                      {editEmployeeID === e.employee_name
                        ? <Button className="success" onClick={() => editEmployee(e.employee_name)}>{t('save')}</Button>
                        : <Button onClick={() => { seteditEmployeeID(e.employee_name); setEditName(e.employee_name); setEditDate(e.date_of_employment); setEditSalary(e.salary); }}>{t('edit')}</Button>}
                      <Button className="danger" onClick={() => deleteEmployee(e.employee_name)}>{t('delete')}</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </BackGround>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .Container{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;}
  .ItemsContainer{width:44vw;height:auto;min-height:32vh;}
  .Row{display:flex;justify-content:center;align-items:center;margin:6px 0;flex-wrap:wrap;}
  .SuccessMsg{text-align:center;font-size:0.85rem;color:var(--emerald);background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius-xs);padding:0.4em 1em;margin:0 1em;}
  .LoaderRow{display:flex;justify-content:center;margin:0.5em 0;}
  .PageFooter{margin-top:1.5em;display:flex;justify-content:center;}
  .dataScreen{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:88vw;max-height:82vh;background:var(--bg-card);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.5em;overflow-y:auto;z-index:1001;box-shadow:var(--shadow-lg);}
  .dataScreenHeader{display:flex;align-items:center;justify-content:space-between;margin-bottom:1em;}
  .dataScreenTitle{font-size:1rem;font-weight:600;color:var(--text-primary);}
  @media(max-width:768px){.ItemsContainer{width:88vw;}.dataScreen{width:96vw;}}
`;

export default Employee;
