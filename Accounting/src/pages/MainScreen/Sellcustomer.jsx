import styled from 'styled-components';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { isGuest } from '../../services/apiClient';
import { debounce, searchCustomer, searchBy_only_Supplies, getCustomerSell } from '../../services/BackendServices';
import { addMockData, updateMockData, deleteMockData } from '../../services/mockService';
import { BackGround, Card, InputField, Button, SearchField, TopBar, ToolTip, Drawer, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components';

import { useTranslation } from 'react-i18next';

function SellCustomer() {
    const { t } = useTranslation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchCustomers, setSearchCustomers] = useState("");
    const [customerData, setcustomerData] = useState([]);
    const [searchSupplies, setSearchSupplies] = useState("");
    const [suppliesData, setSuppliesData] = useState([]);
    const [countity, setCountity] = useState('');
    const [price, setPrice] = useState('');
    const [debt, setdebt] = useState('');
    const [paid, setPaid] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [sellCustomerAdded, setsellCustomerAdded] = useState('');
    const [sellCustomerData, setsellCustomerData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [editSellID, setEditSellID] = useState(null);
    const [editsellData, setEditsellData] = useState({});

    const userData = JSON.parse(localStorage.getItem('user_data'));
    const navigate = useNavigate();

    const fetchCustomerSell = () => getCustomerSell(userData, setsellCustomerData);
    useEffect(() => { fetchCustomerSell(); }, []);

    const searchForCustomer = async (q = '') => searchCustomer(userData, q, setcustomerData);
    const debouncedFetchCustomer = useCallback(debounce(searchForCustomer, 300), []);
    const handleSearchCustomers = (e) => {
        const q = e.target.value; setSearchCustomers(q); debouncedFetchCustomer(q);
        if (!q) setcustomerData([]);
    };

    const searchForSupplies = async (q = '') => searchBy_only_Supplies(userData, q, setSuppliesData);
    const debouncedFetchSupplies = useCallback(debounce(searchForSupplies, 300), []);
    const handleSearchSupplies = (e) => {
        const q = e.target.value; setSearchSupplies(q); debouncedFetchSupplies(q);
        if (!q) setSuppliesData([]);
    };

    const send_data = async (e) => {
        e.preventDefault();
        if (!searchCustomers || !searchSupplies || !countity || !price || !debt || !paid || !date) return alert(t("null_err_fill_all"));

        if (isGuest()) {
            addMockData('customer_sells', { customer_name: searchCustomers, supply: searchSupplies, countity, price, debt, paid, total: countity * price, date_of_buying: date, notes });
            setsellCustomerAdded(`${searchSupplies} added successfully`);
            setSearchCustomers(''); setSearchSupplies(''); setCountity(''); setPrice(''); setdebt(''); setPaid(''); setDate(''); setNotes(''); fetchCustomerSell();
            return;
        }

        try {
            await apiClient.post(`/${userData.user_name}/sell-customer/`, { user: userData.user_name, customer_name: searchCustomers, date_of_buying: date, supply: searchSupplies, price, countity, debt, paid, notes });
            setsellCustomerAdded(`${searchSupplies} added successfully`);
            setSearchCustomers(''); setSearchSupplies(''); setCountity(''); setPrice(''); setdebt(''); setPaid(''); setDate(''); setNotes(''); fetchCustomerSell();
        } catch (error) { alert("Error adding entry."); }
    };

    const editCustomerSell = async (id) => {
        if (isGuest()) {
            updateMockData('customer_sells', id, { ...editsellData, total: editsellData.countity * editsellData.price });
            setEditSellID(null); fetchCustomerSell();
            return;
        }
        try {
            await apiClient.put(`/${userData.user_name}/edit-customer-sell/`, { ...editsellData });
            fetchCustomerSell(); setEditSellID(null);
        } catch (error) { alert("Error editing entry."); }
    };

    const deleteCustomerSell = async (id) => {
        if (isGuest()) {
            deleteMockData('customer_sells', id);
            fetchCustomerSell(); return;
        }
        try {
            await apiClient.delete(`/${userData.user_name}/edit-customer-sell/`, { data: { id } });
            fetchCustomerSell();
        } catch (error) { alert("Error deleting entry."); }
    };

    return (
        <StyledWrapper>
            <BackGround className="Container">
                <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate("/main")} Text={t("sellCustomer")} />
                <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
                <Card className="ItemsContainer">
                    <div className="Firstrow">
                        <div className="typeField">
                            <InputField placeholder={t("customer")} type="text" value={searchCustomers} onChange={handleSearchCustomers} />
                            {searchCustomers && customerData.length > 0 && (
                                <div className="dropdown">{customerData.map((c, i) => (<div key={i} className="dropdown-item" onClick={() => { setSearchCustomers(c.customer_name); setcustomerData([]); }}>{c.customer_name}</div>))}</div>
                            )}
                        </div>
                        <div className="supplyField">
                            <InputField placeholder={t("supply")} type="text" value={searchSupplies} onChange={handleSearchSupplies} />
                            {searchSupplies && suppliesData.length > 0 && (
                                <div className="dropdown">{suppliesData.map((s, i) => (<div key={i} className="dropdown-item" onClick={() => { setSearchSupplies(s.supply_name); setPrice(s.sell_price); setCountity(1); setSuppliesData([]); }}>{s.supply_name}</div>))}</div>
                            )}
                        </div>
                    </div>
                    <div className="Secondrow">
                        <InputField placeholder={t("countity")} type="number" value={countity} onChange={(e) => setCountity(e.target.value)} />
                        <InputField placeholder={t("price")} type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                        <InputField placeholder={t("debt")} type="number" value={debt} onChange={(e) => setdebt(e.target.value)} />
                    </div>
                    <div className="Thirdrow">
                        <InputField placeholder={t("paid")} type="text" value={paid} onChange={(e) => setPaid(e.target.value)} />
                        <InputField placeholder={t("date")} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="Thirdrow"><InputField placeholder={t("notes")} type="text" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
                    <div className="ForthRow"><p style={{ color: 'white' }}>{sellCustomerAdded}</p></div>
                    <div className="FifthRow"><Button onClick={send_data}>{t("sellCustomerbtn")}</Button><ToolTip text={t("sellCustomer_Warn")} /></div>
                </Card>
                <footer><Button onClick={() => setShowTable(!showTable)}>{t("showdata")}</Button></footer>
                {showTable && (
                    <div className='dataScreen'>
                        <Button onClick={() => setShowTable(false)}>{t("close")}</Button>
                        <SearchField onClick={fetchCustomerSell} value={""} onChange={() => {}} />
                        <Table>
                            <TableHeader><TableRow><TableHead>{t("customer")}</TableHead><TableHead>{t("supply")}</TableHead><TableHead>{t("countity")}</TableHead><TableHead>{t("price")}</TableHead><TableHead>{t("total")}</TableHead><TableHead>{t("actions")}</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {sellCustomerData.map((c, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{c.customer_name}</TableCell>
                                        <TableCell>{c.supply}</TableCell>
                                        <TableCell>{editSellID === c.id ? <InputField type="number" value={editsellData.countity} onChange={(e) => setEditsellData({...editsellData, countity: e.target.value})} /> : c.countity}</TableCell>
                                        <TableCell>{editSellID === c.id ? <InputField type="number" value={editsellData.price} onChange={(e) => setEditsellData({...editsellData, price: e.target.value})} /> : c.price}</TableCell>
                                        <TableCell>{c.total}</TableCell>
                                        <TableCell>
                                            {editSellID === c.id ? (
                                                <Button onClick={() => editCustomerSell(c.id)}>{t("save")}</Button>
                                            ) : (
                                                <Button onClick={() => { setEditSellID(c.id); setEditsellData({ ...c }); }}>{t("edit")}</Button>
                                            )}
                                            <Button onClick={() => deleteCustomerSell(c.id)}>{t("delete")}</Button>
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
  .ItemsContainer { width: 43vw; height: 55vh; }
  .Firstrow, .Secondrow, .Thirdrow, .ForthRow, .FifthRow { display: flex; justify-content: center; align-items: center; margin: 10px 0; }
  .typeField, .supplyField { position: relative; }
  .dropdown { position: absolute; top: 100%; left: 0; right: 0; background: #252525; z-index: 1000; max-height: 150px; overflow-y: auto; }
  .dropdown-item { padding: 10px; cursor: pointer; color: white; &:hover { background: #444; } }
  .dataScreen { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90vw; height: 80vh; background: #171717; padding: 20px; border-radius: 20px; overflow-y: auto; z-index: 1001; }
`;

export default SellCustomer;
