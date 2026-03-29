import styled from 'styled-components';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { isGuest } from '../../services/apiClient';
import { Loader, Documentation } from '../../components';

import { useTranslation } from 'react-i18next';

function SetAccount() {
  const { t } = useTranslation();
  const [budget, setBudget] = useState('');
  const [types, setTypes] = useState('');
  const [displayTypes, setDisplayTypes] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [displayCustomer, setDisplayCustomer] = useState([]);
  const [employee, setEmployees] = useState('');
  const [displayEmployee, setDisplayEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [docOpen, setDocOpen] = useState(false);

  const typesRef = useRef(null);
  const customerRef = useRef(null);
  const employeeRef = useRef(null);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user_data'));

  const addToList = (list, setList, value, setValue, ref) => {
    if (value.trim()) {
      setList([...list, value]);
      setValue('');
      if (ref.current) ref.current.focus();
    }
  };

  const removeFromList = (list, setList, index) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  const submitSetupData = async () => {
    if (!budget) return alert(t("null_err_budget"));
    setLoading(true);

    if (isGuest()) {
        setTimeout(() => {
            setLoading(false);
            navigate('/main');
        }, 1000);
        return;
    }

    try {
      await apiClient.post(`/${userData.user_name}/setup-account/`, {
        user: userData.user_name,
        budget,
        types: displayTypes,
        customers: displayCustomer,
        employees: displayEmployee
      });
      navigate('/main');
    } catch (error) {
      alert("Error setting up account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <div className="Container">
        <div className="form">
          <p id="heading">{t("setupYourAccount")}</p>
          <div className="InputContainer">
            <div className="field">
              <input placeholder={t("insertBudget")} className="input-field" type="text" value={budget} onChange={(e) => setBudget(e.target.value)} />
            </div>

            <div className="field">
              <input placeholder={t("insertTypes")} className="input-field" type="text" value={types} ref={typesRef} onChange={(e) => setTypes(e.target.value)} />
              <button className="fieldbtn" onClick={() => addToList(displayTypes, setDisplayTypes, types, setTypes, typesRef)}>+</button>
            </div>
            <div className="ulfield">
              <ul>{displayTypes.map((item, index) => <li key={index}>{item} <button className="listbtn" onClick={() => removeFromList(displayTypes, setDisplayTypes, index)}>x</button></li>)}</ul>
            </div>

            <div className="field">
              <input placeholder={t("insertExistingCustomer")} className="input-field" type="text" value={customerName} ref={customerRef} onChange={(e) => setCustomerName(e.target.value)} />
              <button className="fieldbtn" onClick={() => addToList(displayCustomer, setDisplayCustomer, customerName, setCustomerName, customerRef)}>+</button>
            </div>
            <div className="ulfield">
              <ul>{displayCustomer.map((item, index) => <li key={index}>{item} <button className="listbtn" onClick={() => removeFromList(displayCustomer, setDisplayCustomer, index)}>x</button></li>)}</ul>
            </div>

            <div className="field">
              <input placeholder={t("insertExistingEmployees")} className="input-field" type="text" value={employee} ref={employeeRef} onChange={(e) => setEmployees(e.target.value)} />
              <button className="fieldbtn" onClick={() => addToList(displayEmployee, setDisplayEmployees, employee, setEmployees, employeeRef)}>+</button>
            </div>
            <div className="ulfield">
              <ul>{displayEmployee.map((item, index) => <li key={index}>{item} <button className="listbtn" onClick={() => removeFromList(displayEmployee, setDisplayEmployees, index)}>x</button></li>)}</ul>
            </div>
          </div>
          <div className="btn">
            <button className="button1" onClick={submitSetupData}>{t("submit")}</button>
          </div>
          <div className="Loader">{loading && <Loader width="3" height="20" animateHeight="36" />}</div>
        </div>
        {docOpen && <Documentation docOpen={docOpen} setDocOpen={setDocOpen} />}
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .Container { display: flex; align-items: center; justify-content: center; width: 100vw; height: 100vh; background: #1e1e1e; }
  .form { display: flex; flex-direction: column; gap: 10px; padding: 2em; background-color: #171717; border-radius: 25px; width: 45vw; }
  .field { display: flex; align-items: center; gap: 0.5em; border-radius: 25px; padding: 0.6em; background-color: #171717; margin-bottom: 15px; box-shadow: inset 2px 5px 10px rgb(5, 5, 5); }
  .input-field { background: none; border: none; outline: none; width: 100%; color: #d3d3d3; text-align: center; }
  .fieldbtn, .listbtn, .button1 { background-color: #252525; color: white; border: none; border-radius: 5px; padding: 0.5em 1em; cursor: pointer; }
  .listbtn { background-color: #252525; border-radius: 25px; margin-left: 0.5em; }
  .listbtn:hover { background-color: red; }
  ul { display: flex; overflow-x: auto; padding: 0; list-style: none; margin: 10px 0; }
  ul li { color: #f5f5f5; padding: 8px 12px; margin-right: 10px; background: #252525; border-radius: 10px; display: flex; align-items: center; }
  #heading { text-align: center; color: white; font-size: 1.2em; }
  .Loader { align-self: center; }
`;

export default SetAccount;
