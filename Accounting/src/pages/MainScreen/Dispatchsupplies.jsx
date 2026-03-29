import styled from 'styled-components';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { isGuest } from '../../services/apiClient';
import { debounce, searchBy_only_Supplies, getDispatches, search_dispatched } from '../../services/BackendServices';
import { BackGround, Card, InputField, Button, SearchField, TopBar, ToolTip, Drawer } from '../../components';

import { useTranslation } from 'react-i18next';

function DispatchSupplies() {
    const { t } = useTranslation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchSupplies, setSearchSupplies] = useState("");
    const [suppliesData, setSuppliesData] = useState([]);
    const [countity, setCountity] = useState('');
    const [buy_price, setbuy_price] = useState('');
    const [dispatch_date, setdispatch_date] = useState('');
    const [reason, setreason] = useState('');
    const [dispatchAdded, setdispatchAdded] = useState('');
    const [dispatchData, setdispatchData] = useState([]);
    const [showTable, setShowTable] = useState(false);

    const userData = JSON.parse(localStorage.getItem('user_data'));
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const fetchDispatched = () => getDispatches(userData, setdispatchData);
    useEffect(() => { fetchDispatched(); }, []);

    const searchForSupplies = async (query = '') => searchBy_only_Supplies(userData, query, setSuppliesData);
    const debouncedFetchSupplies = useCallback(debounce(searchForSupplies, 300), []);
    const handleSearchSupplies = (e) => {
        const q = e.target.value; setSearchSupplies(q); debouncedFetchSupplies(q);
        if (!q) setSuppliesData([]);
    };

    const send_data = async (e) => {
        e.preventDefault();
        if (!searchSupplies || !countity || !buy_price || !dispatch_date) return alert(t("null_err_fill_all"));
        if (isGuest()) return alert("Demo Mode: Data cannot be added.");

        try {
            await apiClient.post(`/${userData.user_name}/dispatch-supplies/`, { user: userData.user_name, supply: searchSupplies, countity, buy_price, dispatch_date, reason });
            setdispatchAdded(`${searchSupplies} added successfully`);
            setSearchSupplies(''); setCountity(''); setbuy_price(''); setdispatch_date(''); setreason(''); fetchDispatched();
        } catch (error) { alert("Error adding dispatch."); }
    };

    const deleteDispatch = async (id) => {
        if (isGuest()) return alert("Demo Mode: Data cannot be deleted.");
        try {
            await apiClient.delete(`/${userData.user_name}/edit-dispatches/`, { data: { id } });
            fetchDispatched();
        } catch (error) { alert("Error deleting dispatch."); }
    };

    return (
        <StyledWrapper>
            <BackGround className="Container">
                <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate("/main")} Text={t("dispatchSupplies")} />
                <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
                <Card className="ItemsContainer">
                    <div className="Firstrow">
                        <div className="supplyField">
                            <InputField placeholder={t("supply")} type="text" value={searchSupplies} onChange={handleSearchSupplies} />
                            {searchSupplies && suppliesData.length > 0 && (
                                <div className="dropdown" ref={dropdownRef}>
                                    {suppliesData.map((s, i) => (<div key={i} className="dropdown-item" onClick={() => { setSearchSupplies(s.supply_name); setSuppliesData([]); }}>{s.supply_name}</div>))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="Secondrow">
                        <InputField placeholder={t("countity")} type="number" value={countity} onChange={(e) => setCountity(e.target.value)} />
                        <InputField placeholder={t("buyPrice")} type="number" value={buy_price} onChange={(e) => setbuy_price(e.target.value)} />
                        <InputField placeholder={t("date")} type="date" value={dispatch_date} onChange={(e) => setdispatch_date(e.target.value)} />
                    </div>
                    <div className="Thirdrow"><InputField placeholder={t("reason")} type="text" value={reason} onChange={(e) => setreason(e.target.value)} /></div>
                    <div className="ForthRow"><p style={{ color: 'white' }}>{dispatchAdded}</p></div>
                    <div className="FifthRow"><Button onClick={send_data}>{t("dispatch")}</Button><ToolTip text={t("dispatch_warn")} /></div>
                </Card>
                <footer><Button onClick={() => setShowTable(!showTable)}>{t("showdata")}</Button></footer>
                {showTable && (
                    <div className='dataScreen'>
                        <Button onClick={() => setShowTable(false)}>{t("close")}</Button>
                        <SearchField onClick={fetchDispatched} value={""} onChange={() => {}} />
                        <Table>
                            <TableHeader><TableRow><TableHead>{t("supply")}</TableHead><TableHead>{t("countity")}</TableHead><TableHead>{t("buyPrice")}</TableHead><TableHead>{t("date")}</TableHead><TableHead>{t("reason")}</TableHead><TableHead>{t("actions")}</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {dispatchData.map((d, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{d.supply}</TableCell><TableCell>{d.countity}</TableCell><TableCell>{d.buy_price}</TableCell><TableCell>{d.dispatch_date}</TableCell><TableCell>{d.reason}</TableCell>
                                        <TableCell><Button onClick={() => deleteDispatch(d.id)}>{t("delete")}</Button></TableCell>
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
  .supplyField { position: relative; }
  .dropdown { position: absolute; top: 100%; left: 0; right: 0; background: #252525; z-index: 1000; max-height: 150px; overflow-y: auto; }
  .dropdown-item { padding: 10px; cursor: pointer; color: white; &:hover { background: #444; } }
  .dataScreen { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90vw; height: 80vh; background: #171717; padding: 20px; border-radius: 20px; overflow-y: auto; z-index: 1001; }
`;

export default DispatchSupplies;
