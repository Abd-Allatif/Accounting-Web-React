import styled from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { isGuest } from '../../services/apiClient';
import { getCustomers, debounce, searchCustomer } from '../../services/BackendServices';
import { addMockData, updateMockData, deleteMockData } from '../../services/mockService';
import { BackGround, Card, InputField, Button, SearchField, TopBar, Drawer, Loader, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components';

import { useTranslation } from 'react-i18next';

function Customers() {
    const { t } = useTranslation();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customerData, setcustomerData] = useState([]);
    const [customer, setCustomer] = useState('');
    const [customerAdded, setcustomerAdded] = useState('');
    const [editCustomer, seteditCustomer] = useState(null);
    const [editCustomerValue, seteditCustomerValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showTable, setShowTable] = useState(false);

    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('user_data'));

    const fetchCustomers = () => getCustomers(userData, setcustomerData);
    useEffect(() => { fetchCustomers(); }, []);

    const searchfetchCustomers = async (query = '') => searchCustomer(userData, query, setcustomerData);
    const debouncedFetchCustomers = useCallback(debounce(searchfetchCustomers, 300), []);

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        debouncedFetchCustomers(query);
    };

    const send_data = async (event) => {
        event.preventDefault();
        if (!customer) return alert(t("null_err_customer"));

        setLoading(true);
        if (isGuest()) {
            addMockData('customers', { customer_name: customer, total_debt: 0 });
            setcustomerAdded(`${customer} added successfully`);
            setCustomer('');
            fetchCustomers();
            setLoading(false);
            return;
        }

        try {
            await apiClient.post(`/${userData.user_name}/manage-customers/`, { user: userData.user_name, customer });
            setcustomerAdded(`${customer} added successfully`);
            setCustomer(''); fetchCustomers();
        } catch (error) { alert("Error adding customer."); } finally { setLoading(false); }
    };

    const edit_Customer = async (customerKey) => {
        if (!editCustomerValue) return alert(t("null_err_customer"));

        if (isGuest()) {
            updateMockData('customers', customerKey, { customer_name: editCustomerValue });
            seteditCustomer(null);
            seteditCustomerValue('');
            fetchCustomers();
            return;
        }

        try {
            await apiClient.put(`/${userData.user_name}/edit-customers/`, {
                old_customer: customerKey,
                new_customer: editCustomerValue
            });
            fetchCustomers();
            seteditCustomer(null);
            seteditCustomerValue('');
        } catch (error) { alert("Error editing customer."); }
    };

    const deleteCustomer = async (customerKey) => {
        if (isGuest()) {
            deleteMockData('customers', customerKey);
            fetchCustomers();
            return;
        }
        try {
            await apiClient.delete(`/${userData.user_name}/edit-customers/`, { data: { customer: customerKey } });
            fetchCustomers();
        } catch (error) { alert("Error deleting customer."); }
    };

    return (
        <StyledWrapper>
            <BackGround className="Container">
                <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} backButton_Onclick={() => navigate("/main")} Text={t("customers")} />
                <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
                <Card className="ItemsContainer">
                    <div className="Firstrow"><InputField placeholder={t("customer")} type="text" value={customer} onChange={(e) => setCustomer(e.target.value)} /></div>
                    <div className="Thirdrow">{customerAdded && <p style={{ color: 'white' }}>{customerAdded}</p>}</div>
                    <div className="Fourthrow"><Button onClick={send_data}>{t("addCustomer")}</Button></div>
                    <div className='Loader'>{loading && <Loader width='3' height='20' animateHeight='36' />}</div>
                </Card>
                <footer><Button onClick={() => setShowTable(!showTable)}>{t("showdata")}</Button></footer>
                {showTable && (
                    <div className='dataScreen'>
                        <Button onClick={() => setShowTable(false)}>{t("close")}</Button>
                        <SearchField onClick={fetchCustomers} value={searchQuery} onChange={handleSearchChange} />
                        <Table>
                            <TableHeader><TableRow><TableHead>{t("customers")}</TableHead><TableHead>{t("totalDebt")}</TableHead><TableHead>{t("actions")}</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {customerData.map((c, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            {editCustomer === c.customer_name ? (
                                                <InputField
                                                    type="text"
                                                    value={editCustomerValue}
                                                    onChange={(e) => seteditCustomerValue(e.target.value)}
                                                />
                                            ) : (
                                                c.customer_name
                                            )}
                                        </TableCell>
                                        <TableCell>{c.total_debt}</TableCell>
                                        <TableCell>
                                            {editCustomer === c.customer_name ? (
                                                <Button onClick={() => edit_Customer(c.customer_name)}>{t("save")}</Button>
                                            ) : (
                                                <Button onClick={() => {
                                                    seteditCustomer(c.customer_name);
                                                    seteditCustomerValue(c.customer_name);
                                                }}>{t("edit")}</Button>
                                            )}
                                            <Button onClick={() => deleteCustomer(c.customer_name)}>{t("delete")}</Button>
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
  .ItemsContainer { width: 35vw; height: 35vh; }
  .Firstrow, .Thirdrow, .Fourthrow { display: flex; justify-content: center; align-items: center; margin: 10px 0; }
  .dataScreen { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90vw; height: 80vh; background: #171717; padding: 20px; border-radius: 20px; overflow-y: auto; z-index: 1001; }
  .Loader { align-self: center; }
`;

export default Customers;
