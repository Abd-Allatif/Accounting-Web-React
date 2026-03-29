/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { refreshAccessToken } from "../services/authService";
import apiClient, { isGuest } from "../services/apiClient";
import { getMockData } from "../services/mockService";
import { useTranslation } from "react-i18next";

function CustomDrawer({ isOpen, toggleDrawer }) {
  const { t, i18n } = useTranslation();
  const [sellsFund, setSellsFund] = useState("");
  const [permanatFund, setPermanatFund] = useState("");
  const [drawerSide, setDrawerSide] = useState(i18n.dir() === "rtl" ? "right" : "left");
  const userData = JSON.parse(localStorage.getItem("user_data"));
  const navigate = useNavigate();

  const fetchFunds = async () => {
    if (isGuest()) {
      const f = getMockData('funds'); setSellsFund(f.sells_fund); setPermanatFund(f.permanant_fund); return;
    }
    try {
      const res = await apiClient.get(`/${userData.user_name}/money-funds/`);
      setSellsFund(res.data.sells_fund); setPermanatFund(res.data.permanant_fund);
    } catch (e) { console.error("Error fetching funds"); }
  };

  useEffect(() => { fetchFunds(); }, []);

  const send_data = async (e) => {
    e.preventDefault();
    if (isGuest()) return alert("Demo Mode: Action not available.");
    if (sellsFund != 0) {
        try {
            await apiClient.post(`/${userData.user_name}/move-sells-funds/`, { user: userData.user_name, sellsFund });
            location.reload();
        } catch (e) { alert("Error moving funds."); }
    }
  };

  const changeLanguage = (lng) => { i18n.changeLanguage(lng); setDrawerSide(i18n.dir() === "rtl" ? "right" : "left"); };
  useEffect(() => { document.body.dir = i18n.dir(); }, [i18n.language]);

  return (
    <DrawerWrapper>
      <Overlay isOpen={isOpen} onClick={toggleDrawer(false)} />
      <DrawerContent drawerSide={drawerSide} isOpen={isOpen}>
        <div className="Drawer" onClick={toggleDrawer(false)}>
          <div className="BluredScreen">
            <div className="LanguageSelector">
              {['en', 'ar'].map(l => <button key={l} className={l === i18n.language ? "selected" : "btn"} onClick={() => changeLanguage(l)}>{l === 'en' ? 'English' : 'عربي'}</button>)}
              <button onClick={() => navigate("/main/options")} className="btn">{t("options")}</button>
            </div>
            <h2 className="FundValue">{t("sellsFund")}</h2><p className="FundValueNumber">{sellsFund}</p>
            <button className="SellsFundBtn" onClick={send_data}>{t("moveToPerma")}</button>
            <h2 className="FundValue">{t("permaFund")}</h2><p className="FundValueNumber">{permanatFund}</p>
            <div className="PagesContainer">
                <button onClick={() => navigate("/main/customers")} className="btn">{t("customers")}</button>
                <button onClick={() => navigate("/main/sell-customers")} className="btn">{t("sellCustomer")}</button>
                <button onClick={() => navigate("/main/money-income")} className="btn">{t("moneyIncome")}</button>
                <button onClick={() => navigate("/main/payments")} className="btn">{t("payment")}</button>
                <button onClick={() => navigate("/main/types")} className="btn">{t("types")}</button>
                <button onClick={() => navigate("/main/supplies")} className="btn">{t("supplies")}</button>
                <button onClick={() => navigate("/main/dispatch-supplies")} className="btn">{t("dispatchSupplies")}</button>
                <button onClick={() => navigate("/main/reciepts")} className="btn">{t("buySupplies")}</button>
                <button onClick={() => navigate("/main/employees")} className="btn">{t("employees")}</button>
                <button onClick={() => navigate("/main/inventory")} className="btn">{t("inventory")}</button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </DrawerWrapper>
  );
}

const DrawerWrapper = styled.div` position: relative; `;
const Overlay = styled.div` position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px); opacity: ${p => p.isOpen ? "1" : "0"}; pointer-events: ${p => p.isOpen ? "auto" : "none"}; transition: 0.3s; z-index: 999; `;
const DrawerContent = styled.div`
  .Drawer {
    position: fixed; top: 0; ${p => p.drawerSide === "left" ? "left: 0;" : "right: 0;"} height: 100%; width: 30vw; background: #1e1e1e; color: white; transform: translateX(${p => p.isOpen ? "0" : p.drawerSide === "left" ? "-100%" : "100%"}); transition: 0.3s; z-index: 1000;
  }
  .BluredScreen { padding: 20px; overflow-y: auto; height: 100%; }
  .FundValue { font-size: 20px; margin-top: 10px; }
  .FundValueNumber { font-size: 20px; color: dodgerblue; }
  .PagesContainer { display: flex; flex-direction: column; margin-top: 1em; }
  .btn, .SellsFundBtn { padding: 10px; background: #252525; color: white; border: none; border-radius: 5px; margin-top: 10px; cursor: pointer; &:hover { background: black; } }
  .selected { background: gray; padding: 10px; border-radius: 5px; margin-top: 10px; }
  @media (max-width: 768px) { .Drawer { width: 70vw; } }
`;

export default CustomDrawer;
