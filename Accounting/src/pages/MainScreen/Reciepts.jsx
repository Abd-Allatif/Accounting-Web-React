import styled from 'styled-components';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { isGuest } from '../../services/apiClient';
import { debounce, searchType, searchBy_Supplies, getReciepts, search_Reciepts } from '../../services/BackendServices';
import { BackGround, Card, InputField, Button, SearchField, TopBar, ToolTip, Drawer } from '../../components';

import { useTranslation } from 'react-i18next';

function Reciepts() {
    const { t } = useTranslation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchTypes, setSearchtype] = useState("");
    const [typesData, setTypesData] = useState([]);
    const [searchSupplies, setSearchSupplies] = useState("");
    const [suppliesData, setSuppliesData] = useState([]);
    const [countity, setCountity] = useState('');
    const [buy_price, setBuyPrice] = useState('');
    const [sell_price, setSellPrice] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [recieptAdded, setRecieptAdded] = useState('');
    const [recieptsData, setRecieptsData] = useState([]);
    const [showTable, setShowTable] = useState(false);

    const userData = JSON.parse(localStorage.getItem('user_data'));
    const navigate = useNavigate();

    const fetchReciepts = () => getReciepts(userData, setRecieptsData);
    useEffect(() => { fetchReciepts(); }, []);

    const searchForTypes = async (q = '') => searchType(userData, q, setTypesData);
    const debouncedFetchTypes = useCallback(debounce(searchForTypes, 300), []);
    const handleSearchtype = (e) => {
        const q = e.target.value; setSearchtype(q); debouncedFetchTypes(q);
        if (!q) setTypesData([]);
    };

    const searchForSupplies = async (q = '', type = '') => searchBy_Supplies(userData, q, type, setSuppliesData);
    const debouncedFetchSupplies = useCallback(debounce(searchForSupplies, 300), []);
    const handleSearchSupplies = (e) => {
        const q = e.target.value; setSearchSupplies(q); debouncedFetchSupplies(q, searchTypes);
        if (!q) setSuppliesData([]);
    };

    const buy_Supply = async (e) => {
        e.preventDefault();
        if (!searchTypes || !searchSupplies || !countity || !buy_price || !sell_price || !date) return alert(t("null_err_fill_all"));
        if (isGuest()) return alert("Demo Mode: Data cannot be added.");

        try {
            await apiClient.post(`/${userData.user_name}/buy-supplies/`, { user: userData.user_name, types: searchTypes, supplies: searchSupplies, countity, buy_price, sell_price, date, notes });
            setRecieptAdded(`${searchSupplies} added successfully`);
            setSearchtype(''); setSearchSupplies(''); setCountity(''); setBuyPrice(''); setSellPrice(''); setNotes(''); fetchReciepts();
        } catch (error) { alert("Error adding reciept."); }
    };

    const deleteReciept = async (id) => {
        if (isGuest()) return alert("Demo Mode: Data cannot be deleted.");
        try {
            await apiClient.delete(`/${userData.user_name}/edit-reciepts/`, { data: { id } });
            fetchReciepts();
        } catch (error) { alert("Error deleting reciept."); }
    };

    return (
        <StyledWrapper>
            <BackGround className="Container">
                <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate("/main")} Text={t("buySupplies")} />
                <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
                <Card className="ItemsContainer">
                    <div className="Firstrow">
                        <div className="typeField">
                            <InputField placeholder={t("type")} type="text" value={searchTypes} onChange={handleSearchtype} />
                            {searchTypes && typesData.length > 0 && (
                                <div className="dropdown">{typesData.map((t_item, i) => (<div key={i} className="dropdown-item" onClick={() => { setSearchtype(t_item.type); setTypesData([]); }}>{t_item.type}</div>))}</div>
                            )}
                        </div>
                        <div className="supplyField">
                            <InputField placeholder={t("supply")} type="text" value={searchSupplies} onChange={handleSearchSupplies} />
                            {searchSupplies && suppliesData.length > 0 && (
                                <div className="dropdown">{suppliesData.map((s, i) => (<div key={i} className="dropdown-item" onClick={() => { setSearchSupplies(s.supply_name); setSuppliesData([]); }}>{s.supply_name}</div>))}</div>
                            )}
                        </div>
                    </div>
                    <div className="Secondrow">
                        <InputField placeholder={t("countity")} type="number" value={countity} onChange={(e) => setCountity(e.target.value)} />
                        <InputField placeholder={t("buyPrice")} type="number" value={buy_price} onChange={(e) => setBuyPrice(e.target.value)} />
                        <InputField placeholder={t("sellPrice")} type="number" value={sell_price} onChange={(e) => setSellPrice(e.target.value)} />
                    </div>
                    <div className="Thirdrow">
                        <InputField placeholder={t("date")} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        <InputField placeholder={t("notes")} type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                    <div className="ForthRow"><p style={{ color: 'white' }}>{recieptAdded}</p></div>
                    <div className="FifthRow"><Button onClick={buy_Supply}>{t("buy")}</Button><ToolTip text={t("buySupplies_Warn")} /></div>
                </Card>
                <footer><Button onClick={() => setShowTable(!showTable)}>{t("showdata")}</Button></footer>
                {showTable && (
                    <div className='dataScreen'>
                        <Button onClick={() => setShowTable(false)}>{t("close")}</Button>
                        <SearchField onClick={fetchReciepts} value={""} onChange={() => {}} />
                        <Table>
                            <TableHeader><TableRow><TableHead>{t("type")}</TableHead><TableHead>{t("supply")}</TableHead><TableHead>{t("countity")}</TableHead><TableHead>{t("buyPrice")}</TableHead><TableHead>{t("total")}</TableHead><TableHead>{t("actions")}</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {recieptsData.map((r, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{r.type}</TableCell><TableCell>{r.supply}</TableCell><TableCell>{r.countity}</TableCell><TableCell>{r.buy_price}</TableCell><TableCell>{r.total}</TableCell>
                                        <TableCell><Button onClick={() => deleteReciept(r.id)}>{t("delete")}</Button></TableCell>
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

export default Reciepts;
