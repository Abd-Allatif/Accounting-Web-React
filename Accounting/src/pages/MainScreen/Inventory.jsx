import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { isGuest } from '../../services/apiClient';
import { getSupplies, searchBy_only_Supplies } from '../../services/BackendServices';
import { addMockData, deleteMockData, getMockData } from '../../services/mockService';
import { BackGround, Card, InputField, Button, TopBar, Drawer, Loader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components';

import { useTranslation } from 'react-i18next';

function Inventory() {
    const { t } = useTranslation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suppliesData, setSuppliesData] = useState([]);
    const [inventories, setInventories] = useState([]);
    const [supplyName, setSupplyName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState(null);

    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user_data'));

    const fetchInventories = async () => {
        if (isGuest()) return setInventories(getMockData('inventories'));
        try {
            const response = await apiClient.get(`/${userData.user_name}/generate-inventory/`);
            setInventories(response.data);
        } catch (e) { alert("Error fetching inventories."); }
    };

    useEffect(() => { fetchInventories(); }, []);

    const handleSupplyChange = (event) => {
        const query = event.target.value;
        setSupplyName(query);
        setShowDropdown(true);
        searchBy_only_Supplies(userData, query, setSuppliesData);
    };

    const selectSupply = (name) => {
        setSupplyName(name);
        setShowDropdown(false);
    };

    const generateInventory = async (event) => {
        event.preventDefault();
        if (!supplyName || !startDate || !endDate) return alert(t("null_err_inventory"));

        setLoading(true);
        if (isGuest()) {
            const newInv = {
                id: Date.now(),
                supply: supplyName,
                start_date: startDate,
                end_date: endDate,
                initial_countity: 100,
                final_countity: 80,
                initial_fund: 1000,
                final_fund: 1200,
                sales_countity: 20,
                sales_value: 200,
                purchase_countity: 0,
                purchase_value: 0,
                debt_countity: 5,
                unpaid_customers: 50,
                discrepancy: 0,
                dispatched_supply: 0,
                dispatched_value: 0,
                profits: 100,
                inventory_date: new Date().toISOString().split('T')[0]
            };
            addMockData('inventories', newInv);
            fetchInventories();
            setLoading(false);
            return;
        }

        try {
            await apiClient.post(`/${userData.user_name}/generate-inventory/`, {
                user: userData.user_name,
                supply_name: supplyName,
                start_date: startDate,
                end_date: endDate
            });
            fetchInventories();
        } catch (error) { alert("Error generating inventory."); } finally { setLoading(false); }
    };

    const deleteInventory = async (id) => {
        if (isGuest()) {
            deleteMockData('inventories', id);
            fetchInventories();
            return;
        }
        try {
            await apiClient.delete(`/${userData.user_name}/generate-inventory/`, { data: { id } });
            fetchInventories();
        } catch (error) { alert("Error deleting inventory."); }
    };

    return (
        <StyledWrapper>
            <BackGround className="Container">
                <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate("/main")} Text={t("inventory")} />
                <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
                <Card className="ItemsContainer">
                    <div className="Firstrow">
                        <div className="supplyField">
                            <InputField placeholder={t("supply")} type="text" value={supplyName} onChange={handleSupplyChange} onBlur={() => setTimeout(() => setShowDropdown(false), 200)} />
                            {showDropdown && suppliesData.length > 0 && (
                                <div className="dropdown">
                                    {suppliesData.map((s, i) => <div key={i} className="dropdown-item" onClick={() => selectSupply(s.supply_name)}>{s.supply_name}</div>)}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="Secondrow">
                        <InputField type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <InputField type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <div className="Fourthrow"><Button onClick={generateInventory}>{t("generateInventory")}</Button></div>
                    <div className='Loader'>{loading && <Loader width='3' height='20' animateHeight='36' />}</div>
                </Card>
                <footer><Button onClick={() => setShowTable(!showTable)}>{t("showdata")}</Button></footer>
                {showTable && (
                    <div className='dataScreen'>
                        <Button onClick={() => setShowTable(false)}>{t("close")}</Button>
                        <Table>
                            <TableHeader><TableRow><TableHead>{t("inventory")}</TableHead><TableHead>{t("actions")}</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {inventories.map((inv, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{inv.supply} ({inv.start_date} - {inv.end_date})</TableCell>
                                        <TableCell>
                                            <Button onClick={() => setSelectedInventory(inv)}>{t("show")}</Button>
                                            <Button onClick={() => deleteInventory(inv.id)}>{t("delete")}</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
                {selectedInventory && (
                    <div className='SubScreen'>
                        <Button onClick={() => setSelectedInventory(null)}>{t("close")}</Button>
                        <div style={{ overflowX: 'auto', width: '90vw' }}>
                            <Table>
                                <TableHeader><TableRow>
                                    <TableHead>{t("supply")}</TableHead><TableHead>{t("initialCountity")}</TableHead><TableHead>{t("finalCountity")}</TableHead>
                                    <TableHead>{t("initialFund")}</TableHead><TableHead>{t("finalFund")}</TableHead><TableHead>{t("salesCountity")}</TableHead>
                                    <TableHead>{t("sells_value")}</TableHead><TableHead>{t("purchaseCountity")}</TableHead><TableHead>{t("purchase_value")}</TableHead>
                                    <TableHead>{t("debtCountity")}</TableHead><TableHead>{t("unPaidCustomers")}</TableHead><TableHead>{t("discrepancy")}</TableHead>
                                    <TableHead>{t("dispatchedSupply")}</TableHead><TableHead>{t("dispatchedValue")}</TableHead><TableHead>{t("profits")}</TableHead>
                                    <TableHead>{t("startDate")}</TableHead><TableHead>{t("endDate")}</TableHead><TableHead>{t("inventoryDate")}</TableHead>
                                </TableRow></TableHeader>
                                <TableBody><TableRow>
                                    <TableCell>{selectedInventory.supply}</TableCell><TableCell>{selectedInventory.initial_countity}</TableCell><TableCell>{selectedInventory.final_countity}</TableCell>
                                    <TableCell>{selectedInventory.initial_fund}</TableCell><TableCell>{selectedInventory.final_fund}</TableCell><TableCell>{selectedInventory.sales_countity}</TableCell>
                                    <TableCell>{selectedInventory.sales_value}</TableCell><TableCell>{selectedInventory.purchase_countity}</TableCell><TableCell>{selectedInventory.purchase_value}</TableCell>
                                    <TableCell>{selectedInventory.debt_countity}</TableCell><TableCell>{selectedInventory.unpaid_customers}</TableCell><TableCell>{selectedInventory.discrepancy}</TableCell>
                                    <TableCell>{selectedInventory.dispatched_supply}</TableCell><TableCell>{selectedInventory.dispatched_value}</TableCell><TableCell>{selectedInventory.profits}</TableCell>
                                    <TableCell>{selectedInventory.start_date}</TableCell><TableCell>{selectedInventory.end_date}</TableCell><TableCell>{selectedInventory.inventory_date}</TableCell>
                                </TableRow></TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </BackGround>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .Container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; }
  .ItemsContainer { width: 35vw; height: 35vh; }
  .Firstrow, .Secondrow, .Fourthrow { display: flex; justify-content: center; align-items: center; margin: 10px 0; }
  .supplyField { position: relative; }
  .dropdown { position: absolute; top: 100%; left: 0; right: 0; background: #252525; z-index: 1000; max-height: 150px; overflow-y: auto; }
  .dropdown-item { padding: 8px; cursor: pointer; color: white; &:hover { background: #444; } }
  .dataScreen, .SubScreen { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 95vw; height: 85vh; background: #171717; padding: 20px; border-radius: 20px; overflow-y: auto; z-index: 1001; }
  .Loader { align-self: center; }
`;

export default Inventory;
