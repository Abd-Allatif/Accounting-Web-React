import styled from 'styled-components';
import axios from 'axios';
import { useState } from 'react';
import { Loader, BackGround, InputField, Button } from '../../components';
import { useTranslation } from 'react-i18next';

function Resetpass() {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  function validatePassword(p) {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+]).{8,}$/.test(p);
  }

  const sendNewPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (newPassword !== confirmPassword) { setLoading(false); window.alert('Passwords do not match'); return; }
    if (!validatePassword(newPassword)) { window.alert(t('passwordRegixError')); setLoading(false); return; }
    if (!isValidEmail(email)) { window.alert('Invalid email'); setLoading(false); return; }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/reset-password/`, {
        username, email, reset_code: resetCode, new_password: newPassword,
      });
      window.alert(response.data.message);
      setLoading(false);
      window.location.href = '/';
    } catch {
      setLoading(false);
      window.alert('An error occurred while resetting your password. Please try again later.');
      location.reload();
    }
  };

  return (
    <PageWrapper>
      <BackGround>
        <ResetCard>
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
            <h1 className="CardTitle">{t('resetPassword')}</h1>
            <p className="CardSubtitle">Enter your details and reset code to set a new password</p>
          </div>
          <form className="Form" onSubmit={sendNewPassword}>
            <InputField autoComplete="off" placeholder={t('userName')} type="text" value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())} />
            <InputField autoComplete="off" placeholder={t('email')} type="text" value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())} />
            <InputField autoComplete="off" placeholder={t('resetPasswordCode')} type="text" value={resetCode}
              onChange={(e) => setResetCode(e.target.value)} />
            <InputField placeholder={t('newPassword')} type="password" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} />
            <InputField placeholder={t('confirmPassword')} type="password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} />
            <div className="Actions">
              <Button type="submit">{t('reset')}</Button>
              <Button type="button" className="ghost" onClick={() => window.location.href = '/'}>{t('back')}</Button>
            </div>
          </form>
          {loading && <div className="LoaderRow"><Loader width="3" height="20" animateHeight="36" /></div>}
        </ResetCard>
      </BackGround>
    </PageWrapper>
  );
}

const PageWrapper = styled.div``;

const ResetCard = styled.div`
  background: var(--bg-card); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border); border-radius: var(--radius-xl); box-shadow: var(--shadow-card);
  padding: 2.5em 2em; width: 420px; max-width: 92vw;
  display: flex; flex-direction: column;
  animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
  @keyframes cardIn { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:none} }

  .Brand { display:flex;align-items:center;gap:0.5em;margin-bottom:1.25em; }
  .BrandIcon {
    width:40px;height:40px;border-radius:var(--radius-sm);display:flex;align-items:center;
    justify-content:center;color:#fff;
    background:linear-gradient(135deg,var(--accent),var(--accent-dark));
    box-shadow:0 4px 16px var(--accent-glow);
  }
  .BrandName { font-size:1rem;font-weight:700;color:var(--text-primary); }
  .CardHeader { margin-bottom:1.25em; }
  .CardTitle { font-size:1.4rem;font-weight:700;color:var(--text-primary);margin-bottom:0.3em; }
  .CardSubtitle { font-size:0.82rem;color:var(--text-muted); }
  .Form { display:flex;flex-direction:column; }
  .Actions {
    display:flex;gap:0.5em;margin-top:0.75em;
    .Button{flex:1;justify-content:center;margin-right:0;}
  }
  .LoaderRow { display:flex;justify-content:center;margin-top:1em; }
  @media(max-width:480px){ padding:1.75em 1.25em;border-radius:var(--radius-lg); }
`;

export default Resetpass;
