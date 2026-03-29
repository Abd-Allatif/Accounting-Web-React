import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { isGuest } from '../../services/apiClient';
import { getIncome, debounce, searchIncome } from '../../services/BackendServices';
import { addMockData, deleteMockData, updateMockData } from '../../services/mockService';
import { BackGround, Card, InputField, Button, SearchField, TopBar, Drawer, Loader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components';

import { useTranslation } from 'react-i18next';

function MoneyIncome() {
    const { t } = useTranslation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [incomeData, setIncomeData] = useState([]);
    const [moneyFrom, setMoneyFrom] = useState('');
    const [total, setTotal] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [incomeAdded, setIncomeAdded] = useState('');
    const [editIncomeId, setEditIncomeId] = useState(null);
    const [editIncomeValue, setEditIncomeValue] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [showTable, setShowTable] = useState(false);

    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user_data'));

    const fetchIncome = () => getIncome(userData, setIncomeData);
    useEffect(() => { fetchIncome(); }, []);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        debounce(() => searchIncome(userData, query, setIncomeData), 300)();
    };

    const send_data = async (event) => {
        event.preventDefault();
        if (!moneyFrom || !total || !date) return alert(t("null_err_income"));

        setLoading(true);
        if (isGuest()) {
            addMockData('income', { money_from: moneyFrom, total, date, notes });
            setIncomeAdded(`${moneyFrom} added successfully`);
            setMoneyFrom(''); setTotal(''); setDate(''); setNotes('');
            fetchIncome();
            setLoading(false);
            return;
        }

        try {
            await apiClient.post(`/${userData.user_name}/manage-income/`, {
                user: userData.user_name,
                money_from: moneyFrom,
                total, date, notes
            });
            setIncomeAdded(`${moneyFrom} added successfully`);
            setMoneyFrom(''); setTotal(''); setDate(''); setNotes(''); fetchIncome();
        } catch (error) { alert("Error adding income."); } finally { setLoading(false); }
    };

    const saveIncome = async (id) => {
        if (isGuest()) {
            updateMockData('income', id, editIncomeValue);
            setEditIncomeId(null); fetchIncome();
            return;
        }
        try {
            await apiClient.put(`/${userData.user_name}/edit-income/`, { id, ...editIncomeValue });
            fetchIncome();
            setEditIncomeId(null);
        } catch (error) { alert("Error editing income."); }
    };

    const deleteIncome = async (id) => {
        if (isGuest()) {
            deleteMockData('income', id);
            fetchIncome();
            return;
        }
        try {
            await apiClient.delete(`/${userData.user_name}/edit-income/`, { data: { id } });
            fetchIncome();
        } catch (error) { alert("Error deleting income."); }
    };

    return (
        <StyledWrapper>
            <BackGround className="Container">
                <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate("/main")} Text={t("moneyIncome")} />
                <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
                <Card className="ItemsContainer">
                    <div className="Firstrow">
                        <InputField placeholder={t("moneyFrom")} type="text" value={moneyFrom} onChange={(e) => setMoneyFrom(e.target.value)} />
                        <InputField placeholder={t("total")} type="number" value={total} onChange={(e) => setTotal(e.target.value)} />
                    </div>
                    <div className="Secondrow">
                        <InputField type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        <InputField placeholder={t("notes")} type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                    <div className="Thirdrow">{incomeAdded && <p style={{ color: 'white' }}>{incomeAdded}</p>}</div>
                    <div className="Fourthrow"><Button onClick={send_data}>{t("addIncome")}</Button></div>
                    <div className='Loader'>{loading && <Loader width='3' height='20' animateHeight='36' />}</div>
                </Card>
                <footer><Button onClick={() => setShowTable(!showTable)}>{t("showdata")}</Button></footer>
                {showTable && (
                    <div className='dataScreen'>
                        <Button onClick={() => setShowTable(false)}>{t("close")}</Button>
                        <SearchField onClick={fetchIncome} value={searchQuery} onChange={handleSearchChange} />
                        <Table>
                            <TableHeader><TableRow>
                                <TableHead>{t("moneyFrom")}</TableHead><TableHead>{t("total")}</TableHead>
                                <TableHead>{t("date")}</TableHead><TableHead>{t("notes")}</TableHead>
                                <TableHead>{t("actions")}</TableHead>
                            </TableRow></TableHeader>
                            <TableBody>
                                {incomeData.map((inc, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{editIncomeId === inc.id ? <InputField type="text" value={editIncomeValue.money_from} onChange={(e) => setEditIncomeValue({ ...editIncomeValue, money_from: e.target.value })} /> : inc.money_from}</TableCell>
                                        <TableCell>{editIncomeId === inc.id ? <InputField type="number" value={editIncomeValue.total} onChange={(e) => setEditIncomeValue({ ...editIncomeValue, total: e.target.value })} /> : inc.total}</TableCell>
                                        <TableCell>{editIncomeId === inc.id ? <InputField type="date" value={editIncomeValue.date} onChange={(e) => setEditIncomeValue({ ...editIncomeValue, date: e.target.value })} /> : inc.date}</TableCell>
                                        <TableCell>{editIncomeId === inc.id ? <InputField type="text" value={editIncomeValue.notes} onChange={(e) => setEditIncomeValue({ ...editIncomeValue, notes: e.target.value })} /> : inc.notes}</TableCell>
                                        <TableCell>
                                            {editIncomeId === inc.id ? (
                                                <Button onClick={() => saveIncome(inc.id)}>{t("save")}</Button>
                                            ) : (
                                                <Button onClick={() => { setEditIncomeId(inc.id); setEditIncomeValue({ ...inc }); }}>{t("edit")}</Button>
                                            )}
                                            <Button onClick={() => deleteIncome(inc.id)}>{t("delete")}</Button>
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
  .ItemsContainer { width: 35vw; height: 45vh; }
  .Firstrow, .Secondrow, .Thirdrow, .Fourthrow { display: flex; justify-content: center; align-items: center; margin: 10px 0; }
  .dataScreen { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 95vw; height: 85vh; background: #171717; padding: 20px; border-radius: 20px; overflow-y: auto; z-index: 1001; }
  .Loader { align-self: center; }
`;

export default MoneyIncome;
