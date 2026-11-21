import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loader, BackGround, InputField, Button } from '../../components';
import { useTranslation } from 'react-i18next';

function Register() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [resetCodeMessage, setResetCodeMessage] = useState({ line1: '', line2: '', line3: '' });
  const navigate = useNavigate();

  function returnLoginPage() { setResetCode(''); navigate('/'); }

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  function validatePassword(p) {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{8,}$/.test(p);
  }
  const getRandomString = (n) => {
    const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: n }, () => c[Math.floor(Math.random() * c.length)]).join('');
  };

  const submitData = async (event) => {
    event.preventDefault();
    setLoading(true);
    const code = getRandomString(10);
    setResetCode(code);
    if (!validatePassword(password)) { window.alert(t('passwordRegixError')); setLoading(false); return; }
    if (password !== confirmPassword) { window.alert(t('passwordmatcherror')); setLoading(false); return; }
    if (!isValidEmail(email)) { window.alert('Invalid email address'); setLoading(false); return; }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/register/`, { username, email, password, resetCode: code });
      window.alert('Registration successful');
      setResetCodeMessage({ line1: t('dontLoseIt'), line2: code, line3: t('resetcode') });
      setLoading(false);
    } catch { setLoading(false); window.alert('Something Went Wrong. Please Check Your Information'); }
  };

  return (
    <PageWrapper>
      <BackGround>
        <RegisterCard>
          <div className="Brand">
            <div className="BrandIcon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <span className="BrandName">Accountify</span>
          </div>
          <div className="CardHeader">
            <h1 className="CardTitle">{t('signUp')}</h1>
            <p className="CardSubtitle">Create your account to get started</p>
          </div>
          {resetCode && (
            <div className="CodeBanner">
              <span>🔑</span>
              <div>
                <strong>{resetCodeMessage.line1}</strong>
                <span className="Code"> {resetCodeMessage.line2} </span>
                <small>{resetCodeMessage.line3}</small>
              </div>
            </div>
          )}
          <form className="Form" onSubmit={submitData}>
            <InputField autoComplete="off" placeholder={t('userName')} type="text" value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())} />
            <InputField autoComplete="off" placeholder={t('email')} type="text" value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())} />
            <InputField placeholder={t('password')} type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} />
            <InputField placeholder={t('confirmPassword')} type="password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} />
            <div className="Actions">
              <Button type="submit">{t('signUp')}</Button>
              <Button type="button" className="ghost" onClick={returnLoginPage}>{t('back')}</Button>
            </div>
          </form>
          {loading && <div className="LoaderRow"><Loader width="3" height="20" animateHeight="36" /></div>}
        </RegisterCard>
      </BackGround>
    </PageWrapper>
  );
}

const PageWrapper = styled.div``;

const RegisterCard = styled.div`
  background: var(--bg-card); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border); border-radius: var(--radius-xl); box-shadow: var(--shadow-card);
  padding: 2.5em 2em; width: 420px; max-width: 92vw;
  display: flex; flex-direction: column; gap: 0;
  animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
  @keyframes cardIn { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:none} }

  .Brand { display:flex; align-items:center; gap:0.5em; margin-bottom:1.25em; }
  .BrandIcon {
    width:40px;height:40px;border-radius:var(--radius-sm);display:flex;align-items:center;
    justify-content:center;color:#fff;
    background:linear-gradient(135deg,var(--accent),var(--accent-dark));
    box-shadow:0 4px 16px var(--accent-glow);
  }
  .BrandName { font-size:1rem;font-weight:700;color:var(--text-primary); }
  .CardHeader { margin-bottom:1.25em; }
  .CardTitle { font-size:1.4rem;font-weight:700;color:var(--text-primary);margin-bottom:0.3em; }
  .CardSubtitle { font-size:0.85rem;color:var(--text-muted); }
  .CodeBanner {
    display:flex;gap:0.6em;align-items:flex-start;
    background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);
    border-radius:var(--radius-sm);padding:0.75em 1em;margin-bottom:0.75em;font-size:0.85rem;
    strong{color:var(--amber);display:block;}
    small{color:var(--text-muted);}
  }
  .Code { font-family:monospace;font-weight:700;color:var(--rose); }
  .Form { display:flex;flex-direction:column; }
  .Actions {
    display:flex;gap:0.5em;margin-top:0.75em;
    .Button{flex:1;justify-content:center;margin-right:0;}
  }
  .LoaderRow { display:flex;justify-content:center;margin-top:1em; }
  @media (max-width:480px) { padding:1.75em 1.25em;border-radius:var(--radius-lg); }
`;

export default Register;
