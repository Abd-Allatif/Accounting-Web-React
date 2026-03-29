import styled from "styled-components";
import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import apiClient, { isGuest } from "../../services/apiClient";
import { debounce, searchBy_only_Supplies, getSell } from "../../services/BackendServices";
import { addMockData, updateMockData, deleteMockData } from "../../services/mockService";
import { Drawer, BackGround, Card, InputField, Button, SearchField, TopBar, ToolTip, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components";
import { useTranslation } from "react-i18next";

function MainSellScreen() {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchSupplies, setSearchSupplies] = useState("");
  const [suppliesData, setSuppliesData] = useState([]);
  const [countity, setCountity] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [sellAdded, setsellAdded] = useState("");
  const [sellData, setSellData] = useState([]);
  const [searchSells, setSearchSells] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [editSellID, setEditSellID] = useState(null);
  const [editsellData, setEditsellData] = useState({});

  const userData = JSON.parse(localStorage.getItem("user_data"));
  const navigate = useNavigate();

  const fetchSells = () => getSell(userData, setSellData);
  useEffect(() => { fetchSells(); }, []);

  const searchForSupplies = async (query = "") => searchBy_only_Supplies(userData, query, setSuppliesData);
  const debouncedFetchSupplies = useCallback(debounce(searchForSupplies, 300), []);

  const handleSearchSupplies = (e) => {
    const q = e.target.value; setSearchSupplies(q); debouncedFetchSupplies(q);
    if (!q) setSuppliesData([]);
  };

  const handleSuppliesSelect = (s) => { setSearchSupplies(s.supply_name); setPrice(s.sell_price); setCountity(1); setSuppliesData([]); };

  const send_data = async (e) => {
    e.preventDefault();
    if (!searchSupplies || !countity || !price || !date) return alert(t("null_err_fill_all"));

    if (isGuest()) {
        addMockData('sells', { supply: searchSupplies, countity, price, total: countity * price, date, notes });
        setsellAdded(`${searchSupplies} added successfully`);
        setSearchSupplies(""); setCountity(""); setPrice(""); setDate(""); setNotes(""); fetchSells();
        return;
    }

    try {
      await apiClient.post(`/${userData.user_name}/sell-supplies/`, { user: userData.user_name, supplies: searchSupplies, countity, price, date, notes });
      setsellAdded(`${searchSupplies} added successfully`);
      setSearchSupplies(""); setCountity(""); setPrice(""); setDate(""); setNotes("");
      fetchSells();
    } catch (error) { alert("Error saving sell."); }
  };

  const editSell = async (id) => {
      if (isGuest()) {
          updateMockData('sells', id, { ...editsellData, total: editsellData.countity * editsellData.price });
          setEditSellID(null); fetchSells();
          return;
      }
      try {
          await apiClient.put(`/${userData.user_name}/edit-sell/`, { ...editsellData });
          fetchSells(); setEditSellID(null);
      } catch (error) { alert("Error editing sell."); }
  };

  const deleteSell = async (id) => {
    if (isGuest()) {
        deleteMockData('sells', id);
        fetchSells(); return;
    }
    try {
      await apiClient.delete(`/${userData.user_name}/edit-sell/`, { data: { id } });
      fetchSells();
    } catch (error) { alert("Error deleting sell."); }
  };

  return (
    <StyledWrapper>
      <BackGround className="Container">
        <TopBar drawerButton_Onclick={() => setIsDrawerOpen(true)} buttonText={t("logout")} backButton_Onclick={() => { logout(); navigate("/"); }} Text={t("sellSupplies")} />
        <Drawer isOpen={isDrawerOpen} toggleDrawer={(open) => () => setIsDrawerOpen(open)} />
        <Card className="ItemsContainer">
          <div className="Row">
            <div className="supplyField">
              <InputField placeholder={t("supply")} type="text" value={searchSupplies} onChange={handleSearchSupplies} />
              {searchSupplies && suppliesData.length > 0 && (
                <div className="dropdown">
                  {suppliesData.map((s, i) => (
                    <div key={i} className="dropdown-item" onClick={() => handleSuppliesSelect(s)}>{s.supply_name}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="Row">
            <InputField placeholder={t("countity")} type="number" value={countity} onChange={(e) => setCountity(e.target.value)} />
            <InputField placeholder={t("price")} type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            <InputField placeholder={t("date")} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="Row"><InputField placeholder={t("notes")} type="text" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          <div className="Row"><p style={{ color: "white" }}>{sellAdded}</p></div>
          <div className="Row"><Button onClick={send_data}>{t("sell")}</Button><ToolTip text={t("main_warn")} /></div>
        </Card>
        <footer><Button onClick={() => setShowTable(!showTable)}>{t("showdata")}</Button></footer>
        {showTable && (
          <div className="dataScreen">
            <Button onClick={() => setShowTable(false)}>{t("close")}</Button>
            <SearchField value={searchSells} onChange={(e) => setSearchSells(e.target.value)} onClick={fetchSells} />
            <Table>
              <TableHeader><TableRow><TableHead>{t("supply")}</TableHead><TableHead>{t("countity")}</TableHead><TableHead>{t("price")}</TableHead><TableHead>{t("total")}</TableHead><TableHead>{t("date")}</TableHead><TableHead>{t("actions")}</TableHead></TableRow></TableHeader>
              <TableBody>
                {sellData.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell>{s.supply}</TableCell>
                    <TableCell>{editSellID === s.id ? <InputField type="number" value={editsellData.countity} onChange={(e) => setEditsellData({...editsellData, countity: e.target.value})} /> : s.countity}</TableCell>
                    <TableCell>{editSellID === s.id ? <InputField type="number" value={editsellData.price} onChange={(e) => setEditsellData({...editsellData, price: e.target.value})} /> : s.price}</TableCell>
                    <TableCell>{s.total}</TableCell>
                    <TableCell>{editSellID === s.id ? <InputField type="date" value={editsellData.date} onChange={(e) => setEditsellData({...editsellData, date: e.target.value})} /> : s.date}</TableCell>
                    <TableCell>
                      {editSellID === s.id ? (
                          <Button onClick={() => editSell(s.id)}>{t("save")}</Button>
                      ) : (
                          <Button onClick={() => { setEditSellID(s.id); setEditsellData({ ...s }); }}>{t("edit")}</Button>
                      )}
                      <Button onClick={() => deleteSell(s.id)}>{t("delete")}</Button>
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
  .ItemsContainer { width: 45vw; height: 55vh; }
  .Row { display: flex; justify-content: center; align-items: center; margin: 10px 0; }
  .supplyField { position: relative; }
  .dropdown { position: absolute; top: 100%; left: 0; right: 0; background: #252525; z-index: 1000; max-height: 150px; overflow-y: auto; }
  .dropdown-item { padding: 10px; cursor: pointer; color: white; &:hover { background: #444; } }
  .dataScreen { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90vw; height: 80vh; background: #171717; padding: 20px; border-radius: 20px; overflow-y: auto; z-index: 1001; }
`;

export default MainSellScreen;
