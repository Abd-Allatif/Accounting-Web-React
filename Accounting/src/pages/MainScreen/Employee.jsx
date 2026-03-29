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

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        debouncedFetchEmployees(query);
    };

    const send_data = async (event) => {
        event.preventDefault();
        if (!employeeName || !salary || !empDate) return alert(t("null_err_employee"));

        setLoading(true);
        if (isGuest()) {
            addMockData('employees', { employee_name: employeeName, salary, date_of_employment: empDate, job_title: 'N/A' });
            setEmployeeAdded(`${employeeName} added successfully`);
            setEmployeeName(''); setSalary(''); setEmpDate('');
            fetchEmployees();
            setLoading(false);
            return;
        }

        try {
            await apiClient.post(`/${userData.user_name}/employ-employees/`, {
                user: userData.user_name,
                employee_name: employeeName,
                salary,
                date_of_employment: empDate
            });
            setEmployeeAdded(`${employeeName} added successfully`);
            setEmployeeName(''); setSalary(''); setEmpDate(''); fetchEmployees();
        } catch (error) { alert("Error adding employee."); } finally { setLoading(false); }
    };

    const editEmployee = async (employeeKey) => {
        if (!editName || !editSalary || !editDate) return alert(t("null_err_employee"));

        if (isGuest()) {
            updateMockData('employees', employeeKey, { employee_name: editName, salary: editSalary, date_of_employment: editDate });
            seteditEmployeeID(null); fetchEmployees();
            return;
        }

        try {
            await apiClient.put(`/${userData.user_name}/edit-employees/`, {
                old_employee: employeeKey,
                new_employee: editName,
                new_salary: editSalary,
                new_date: editDate
            });
            fetchEmployees();
            seteditEmployeeID(null);
        } catch (error) { alert("Error editing employee."); }
    };

    const deleteEmployee = async (employeeKey) => {
        if (isGuest()) {
            deleteMockData('employees', employeeKey);
            fetchEmployees();
            return;
        }
        try {
            await apiClient.delete(`/${userData.user_name}/edit-employees/`, { data: { employee: employeeKey } });
            fetchEmployees();
        } catch (error) { alert("Error deleting employee."); }
    };

    return (
        <StyledWrapper>
            <BackGround className="Container">
                <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate("/main")} Text={t("employees")} />
                <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
                <Card className="ItemsContainer">
                    <div className="Firstrow">
                        <InputField placeholder={t("employeeName")} type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
                        <InputField placeholder={t("salary")} type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
                    </div>
                    <div className="Secondrow"><InputField type="date" value={empDate} onChange={(e) => setEmpDate(e.target.value)} /></div>
                    <div className="Thirdrow">{employeeAdded && <p style={{ color: 'white' }}>{employeeAdded}</p>}</div>
                    <div className="Fourthrow"><Button onClick={send_data}>{t("employ")}</Button></div>
                    <div className='Loader'>{loading && <Loader width='3' height='20' animateHeight='36' />}</div>
                </Card>
                <footer><Button onClick={() => setShowTable(!showTable)}>{t("showdata")}</Button></footer>
                {showTable && (
                    <div className='dataScreen'>
                        <Button onClick={() => setShowTable(false)}>{t("close")}</Button>
                        <SearchField onClick={fetchEmployees} value={searchQuery} onChange={handleSearchChange} />
                        <Table>
                            <TableHeader><TableRow><TableHead>{t("employees")}</TableHead><TableHead>{t("date")}</TableHead><TableHead>{t("salary")}</TableHead><TableHead>{t("actions")}</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {employeeData.map((e, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            {editEmployeeID === e.employee_name ? (
                                                <InputField type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                                            ) : (
                                                e.employee_name
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editEmployeeID === e.employee_name ? (
                                                <InputField type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                                            ) : (
                                                e.date_of_employment
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editEmployeeID === e.employee_name ? (
                                                <InputField type="text" value={editSalary} onChange={(e) => setEditSalary(e.target.value)} />
                                            ) : (
                                                e.salary
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editEmployeeID === e.employee_name ? (
                                                <Button onClick={() => editEmployee(e.employee_name)}>{t("save")}</Button>
                                            ) : (
                                                <Button onClick={() => {
                                                    seteditEmployeeID(e.employee_name);
                                                    setEditName(e.employee_name);
                                                    setEditDate(e.date_of_employment);
                                                    setEditSalary(e.salary);
                                                }}>{t("edit")}</Button>
                                            )}
                                            <Button onClick={() => deleteEmployee(e.employee_name)}>{t("delete")}</Button>
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
  .Container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; }
  .ItemsContainer { width: 35vw; height: 40vh; }
  .Firstrow, .Secondrow, .Thirdrow, .Fourthrow { display: flex; justify-content: center; align-items: center; margin: 10px 0; }
  .dataScreen { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90vw; height: 80vh; background: #171717; padding: 20px; border-radius: 20px; overflow-y: auto; z-index: 1001; }
  .Loader { align-self: center; }
`;

export default Employee;
