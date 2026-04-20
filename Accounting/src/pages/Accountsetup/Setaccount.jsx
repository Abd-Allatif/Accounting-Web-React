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
    if (value.trim()) { setList([...list, value]); setValue(''); if (ref.current) ref.current.focus(); }
  };
  const removeFromList = (list, setList, index) => {
    const n = [...list]; n.splice(index, 1); setList(n);
  };

  const submitSetupData = async () => {
    if (!budget) return alert(t('null_err_budget'));
    setLoading(true);
    if (isGuest()) { setTimeout(() => { setLoading(false); navigate('/main'); }, 1000); return; }
    try {
      await apiClient.post(`/${userData.user_name}/setup-account/`, {
        user: userData.user_name, budget, types: displayTypes, customers: displayCustomer, employees: displayEmployee
      });
      navigate('/main');
    } catch { alert('Error setting up account.'); } finally { setLoading(false); }
  };

  return (
    <PageWrapper>
      <div className="SetupPage">
        <div className="SetupCard">
          {/* Brand */}
          <div className="Brand">
            <div className="BrandIcon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <span className="BrandName">Accountify</span>
          </div>

          <div className="CardHeader">
            <h1 className="CardTitle">{t('setupYourAccount')}</h1>
            <p className="CardSubtitle">Set up your initial data to get started</p>
          </div>

          {/* Budget */}
          <div className="FieldGroup">
            <label className="FieldLabel">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" strokeLinecap="round" />
              </svg>
              {t('insertBudget')}
            </label>
            <div className="InputRow">
              <input className="FieldInput" placeholder={t('insertBudget')} type="text"
                value={budget} onChange={(e) => setBudget(e.target.value)} />
            </div>
          </div>

          {/* Types */}
          <div className="FieldGroup">
            <label className="FieldLabel">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" />
              </svg>
              {t('insertTypes')}
            </label>
            <div className="InputRow">
              <input className="FieldInput" placeholder={t('insertTypes')} type="text"
                value={types} ref={typesRef} onChange={(e) => setTypes(e.target.value)} />
              <button className="AddBtn" onClick={() => addToList(displayTypes, setDisplayTypes, types, setTypes, typesRef)}>+</button>
            </div>
            <div className="TagList">
              {displayTypes.map((item, i) => (
                <span key={i} className="Tag">
                  {item}
                  <button className="TagRemove" onClick={() => removeFromList(displayTypes, setDisplayTypes, i)}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Customers */}
          <div className="FieldGroup">
            <label className="FieldLabel">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
              </svg>
              {t('insertExistingCustomer')}
            </label>
            <div className="InputRow">
              <input className="FieldInput" placeholder={t('insertExistingCustomer')} type="text"
                value={customerName} ref={customerRef} onChange={(e) => setCustomerName(e.target.value)} />
              <button className="AddBtn" onClick={() => addToList(displayCustomer, setDisplayCustomer, customerName, setCustomerName, customerRef)}>+</button>
            </div>
            <div className="TagList">
              {displayCustomer.map((item, i) => (
                <span key={i} className="Tag">
                  {item}
                  <button className="TagRemove" onClick={() => removeFromList(displayCustomer, setDisplayCustomer, i)}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Employees */}
          <div className="FieldGroup">
            <label className="FieldLabel">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" />
              </svg>
              {t('insertExistingEmployees')}
            </label>
            <div className="InputRow">
              <input className="FieldInput" placeholder={t('insertExistingEmployees')} type="text"
                value={employee} ref={employeeRef} onChange={(e) => setEmployees(e.target.value)} />
              <button className="AddBtn" onClick={() => addToList(displayEmployee, setDisplayEmployees, employee, setEmployees, employeeRef)}>+</button>
            </div>
            <div className="TagList">
              {displayEmployee.map((item, i) => (
                <span key={i} className="Tag">
                  {item}
                  <button className="TagRemove" onClick={() => removeFromList(displayEmployee, setDisplayEmployees, i)}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="FooterRow">
            <button className="SubmitBtn" onClick={submitSetupData}>{t('submit')}</button>
            <button className="DocBtn" onClick={() => setDocOpen(true)}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {t('openDoc')}
            </button>
          </div>
          {loading && <div className="LoaderRow"><Loader width="3" height="20" animateHeight="36" /></div>}
        </div>
        {docOpen && <Documentation docOpen={docOpen} setDocOpen={setDocOpen} />}
      </div>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  .SetupPage {
    display:flex; align-items:center; justify-content:center;
    width:100vw; min-height:100vh; padding:2em 1em;
    background:var(--bg-root);
    background-image:
      radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99,102,241,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 90%, rgba(34,211,238,0.05) 0%, transparent 60%);
  }

  .SetupCard {
    background:var(--bg-card); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
    border:1px solid var(--border); border-radius:var(--radius-xl); box-shadow:var(--shadow-card);
    padding:2.25em 2em; width:520px; max-width:95vw;
    display:flex; flex-direction:column; gap:0.25em;
    animation:cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
    @keyframes cardIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
  }

  .Brand { display:flex;align-items:center;gap:0.5em;margin-bottom:1em; }
  .BrandIcon {
    width:38px;height:38px;border-radius:var(--radius-sm);display:flex;align-items:center;
    justify-content:center;color:#fff;
    background:linear-gradient(135deg,var(--accent),var(--accent-dark));
    box-shadow:0 4px 16px var(--accent-glow);
  }
  .BrandName { font-size:0.95rem;font-weight:700;color:var(--text-primary); }
  .CardHeader { margin-bottom:1.25em; }
  .CardTitle { font-size:1.4rem;font-weight:700;color:var(--text-primary);margin-bottom:0.3em; }
  .CardSubtitle { font-size:0.82rem;color:var(--text-muted); }

  .FieldGroup { display:flex;flex-direction:column;gap:0.4em;margin-bottom:0.9em; }

  .FieldLabel {
    display:flex;align-items:center;gap:0.35em;
    font-size:0.8rem;font-weight:500;color:var(--text-secondary);
    text-transform:uppercase;letter-spacing:0.05em;
    svg { color:var(--accent-light); }
  }

  .InputRow { display:flex;gap:0.4em; }

  .FieldInput {
    flex:1;padding:0.6em 0.9em;
    background:var(--bg-input);border:1px solid var(--border);
    border-radius:var(--radius-sm);color:var(--text-primary);
    font-size:0.875rem;font-family:var(--font-sans);
    outline:none;transition:border-color 150ms,box-shadow 150ms;
    &:focus {
      border-color:var(--accent);
      box-shadow:0 0 0 3px rgba(99,102,241,0.15);
    }
    &::placeholder { color:var(--text-muted); }
  }

  .AddBtn {
    width:38px;height:38px;border-radius:var(--radius-sm);flex-shrink:0;
    border:1px solid var(--border-hover);background:rgba(99,102,241,0.1);
    color:var(--accent-light);font-size:1.2rem;cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    transition:all 150ms;
    &:hover { background:rgba(99,102,241,0.2);border-color:var(--accent); }
  }

  .TagList {
    display:flex;flex-wrap:wrap;gap:0.4em;min-height:0;
  }

  .Tag {
    display:inline-flex;align-items:center;gap:0.3em;
    background:rgba(99,102,241,0.1);border:1px solid var(--border-hover);
    border-radius:var(--radius-full);padding:0.25em 0.65em;
    font-size:0.8rem;color:var(--text-accent);
  }

  .TagRemove {
    background:none;border:none;color:var(--text-muted);cursor:pointer;
    font-size:1rem;line-height:1;padding:0;
    &:hover { color:var(--rose); }
  }

  .FooterRow {
    display:flex;gap:0.5em;margin-top:1em;
  }

  .SubmitBtn {
    flex:1;padding:0.7em;border-radius:var(--radius-sm);border:none;
    background:linear-gradient(135deg,var(--accent),var(--accent-dark));
    color:#fff;font-weight:600;font-size:0.9rem;cursor:pointer;
    transition:all 200ms;
    &:hover { box-shadow:0 4px 20px var(--accent-glow);transform:translateY(-1px); }
  }

  .DocBtn {
    display:flex;align-items:center;gap:0.35em;
    padding:0.65em 1em;border-radius:var(--radius-sm);
    border:1px solid var(--border-hover);background:transparent;
    color:var(--text-secondary);font-size:0.85rem;cursor:pointer;
    transition:all 150ms;
    &:hover { border-color:var(--accent);color:var(--text-primary);background:rgba(99,102,241,0.06); }
  }

  .LoaderRow { display:flex;justify-content:center;margin-top:0.75em; }

  @media(max-width:560px) {
    .SetupCard { padding:1.75em 1.25em; }
    .FooterRow { flex-direction:column; }
  }
`;

export default SetAccount;
