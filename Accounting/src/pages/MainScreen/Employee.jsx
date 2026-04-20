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
  const [showAddModal, setShowAddModal] = useState(false);
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
      setEmployeeAdded(`${employeeName} added successfully`); setEmployeeName(''); setSalary(''); setEmpDate(''); fetchEmployees(); setLoading(false);
      setTimeout(() => setShowAddModal(false), 1000);
      return;
    }
    try {
      await apiClient.post(`/${userData.user_name}/employ-employees/`, { user: userData.user_name, employee_name: employeeName, salary, date_of_employment: empDate });
      setEmployeeAdded(`${employeeName} added successfully`); setEmployeeName(''); setSalary(''); setEmpDate(''); fetchEmployees();
      setTimeout(() => setShowAddModal(false), 1000);
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
        
        <div className="MainContent">
          <div className="PageHeader">
            <h2 className="PageTitle">{t('employees')}</h2>
            <Button className="success AddBtn" onClick={() => { setEmployeeAdded(''); setShowAddModal(true); }}>
              + {t('employ')}
            </Button>
          </div>

          <div className="TableSection">
            <SearchField onClick={fetchEmployees} value={searchQuery} onChange={handleSearchChange} />
            <div className="TableScrollWrapper">
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
          </div>
        </div>

        {showAddModal && (
          <div className="ModalOverlay" onClick={(e) => e.target.className === 'ModalOverlay' && setShowAddModal(false)}>
            <Card className="AddModalCard">
              <div className="ModalHeader">
                <h3 className="ModalTitle">{t('employ')}</h3>
                <button className="CloseBtn" onClick={() => setShowAddModal(false)}>×</button>
              </div>
              <div className="ModalBody">
                <div className="Row">
                  <InputField placeholder={t('employeeName')} type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
                </div>
                <div className="Row">
                  <InputField placeholder={t('salary')} type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
                </div>
                <div className="Row">
                  <InputField type="date" value={empDate} onChange={(e) => setEmpDate(e.target.value)} />
                </div>
                {employeeAdded && <div className="SuccessMsg">{employeeAdded}</div>}
                <div className="Row"><Button className="accent" onClick={send_data}>{t('employ')}</Button></div>
                {loading && <div className="LoaderRow"><Loader width="3" height="20" animateHeight="36" /></div>}
              </div>
            </Card>
          </div>
        )}
      </BackGround>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .Container { display:flex;flex-direction:column;min-height:100vh; }
  
  .MainContent {
    flex: 1; padding: 2em; margin-top: 60px; max-width: 1400px; width: 100%; align-self: center; display: flex; flex-direction: column; gap: 1.5em;
  }
  
  .PageHeader { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 1em; }
  .PageTitle { font-size: 1.8rem; font-weight: 700; color: var(--text-primary); margin: 0; }
  .AddBtn { font-weight: 600; padding: 0.6em 1.2em; font-size: 0.95rem; }

  .TableSection { background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border); padding: 1.5em; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 1em; flex: 1; min-height: 0; }
  .TableScrollWrapper { overflow-x: auto; flex: 1; border-radius: var(--radius-md); }

  .ModalOverlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1em; animation: fadeIn 0.2s ease; }
  .AddModalCard { width: 450px; max-width: 100%; padding: 1.5em; animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1); }
  .ModalHeader { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5em; }
  .ModalTitle { font-size: 1.2rem; font-weight: 600; color: var(--text-primary); margin: 0; }
  .CloseBtn { background: transparent; border: none; color: var(--text-muted); font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1; width: 32px; height: 32px; border-radius: 50%; transition: all 0.2s ease; }
  .CloseBtn:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
  .ModalBody { display: flex; flex-direction: column; gap: 1em; }
  
  .Row { display:flex;justify-content:center;align-items:center; width: 100%; }
  .Row > * { width: 100%; }
  .SuccessMsg { text-align:center;font-size:0.85rem;color:var(--emerald);background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius-xs);padding:0.6em 1em; }
  .LoaderRow { display:flex;justify-content:center;margin:0.5em 0; }
  
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  @media(max-width:768px) { 
    .MainContent { padding: 1em; padding-top: 2em; margin-top: 50px; }
    .PageHeader { flex-direction: column; align-items: flex-start; gap: 1em; }
    .AddBtn { width: 100%; }
    .TableSection { padding: 1em; }
  }
`;

export default Employee;
