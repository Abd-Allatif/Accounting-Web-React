import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, BackGround, InputField, Button } from '../../components';
import { login, guestLogin } from '../../services/authService';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const { t } = useTranslation();
  const { refreshAuth } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('is_guest');
    refreshAuth();
  }, []);

  const handleGuestLogin = () => {
    guestLogin((path) => { refreshAuth(); navigate(path); });
  };

  const submitData = async (event) => {
    event.preventDefault();
    if (!password) return window.alert('Password Must Not be Empty');
    setLoading(true);
    try {
      await login(
        identifier, password,
        () => { refreshAuth(); navigate('/main'); },
        () => { refreshAuth(); navigate('/setup-account'); }
      );
      setLoading(false);
    } catch (error) {
      window.alert('Invalid Credentials');
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <BackGround>
        <LoginCard>
          {/* Logo mark */}
          <div className="Brand">
            <div className="BrandIcon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <span className="BrandName">Accountify</span>
          </div>

          <div className="CardHeader">
            <h1 className="CardTitle">{t('login')}</h1>
            <p className="CardSubtitle">Welcome back — sign in to continue</p>
          </div>

          <form className="Form" onSubmit={submitData}>
            <div className="Fields">
              <InputField
                placeholder={t('emailOrUserName')}
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value.toLowerCase())}
                includeSVG
                svgPath="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
              />
              <InputField
                placeholder={t('password')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                includeSVG
                svgPath="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"
              />
            </div>

            <div className="ForgotRow">
              <button type="button" className="ForgotLink" onClick={() => navigate('/reset-pass')}>
                Forgot password?
              </button>
            </div>

            <div className="Actions">
              <Button type="submit" className="LoginBtn">{t('login')}</Button>
              <Button type="button" className="RegisterBtn" onClick={() => navigate('/register')}>{t('signUp')}</Button>
            </div>
          </form>

          <div className="Divider"><span>or</span></div>

          <button className="GuestBtn" onClick={handleGuestLogin}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Guest Demo Login
          </button>

          {loading && (
            <div className="LoaderRow">
              <Loader width="3" height="20" animateHeight="36" />
            </div>
          )}
        </LoginCard>
      </BackGround>
    </PageWrapper>
  );
}

const PageWrapper = styled.div``;

const LoginCard = styled.div`
  background: var(--bg-card, rgba(13,13,26,0.75));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border, rgba(99,102,241,0.12));
  border-radius: var(--radius-xl, 28px);
  box-shadow: var(--shadow-card);
  padding: 2.5em 2em;
  width: 420px;
  max-width: 92vw;
  display: flex;
  flex-direction: column;
  gap: 0;
  animation: cardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .Brand {
    display: flex;
    align-items: center;
    gap: 0.5em;
    margin-bottom: 1.5em;
  }

  .BrandIcon {
    width: 44px;
    height: 44px;
    border-radius: var(--radius-sm, 10px);
    background: linear-gradient(135deg, var(--accent, #6366f1), var(--accent-dark, #4f46e5));
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 4px 16px var(--accent-glow, rgba(99,102,241,0.3));
  }

  .BrandName {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary, #e8e8ff);
    letter-spacing: -0.01em;
  }

  .CardHeader {
    margin-bottom: 1.5em;
  }

  .CardTitle {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary, #e8e8ff);
    letter-spacing: -0.02em;
    margin-bottom: 0.3em;
  }

  .CardSubtitle {
    font-size: 0.875rem;
    color: var(--text-muted, rgba(232,232,255,0.3));
  }

  .Form {
    display: flex;
    flex-direction: column;
    gap: 0.25em;
  }

  .Fields {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5em;
  }

  .ForgotRow {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1.25em;
  }

  .ForgotLink {
    background: none;
    border: none;
    color: var(--text-accent, #818cf8);
    font-size: 0.82rem;
    cursor: pointer;
    padding: 0;
    &:hover { color: var(--accent-light, #a5b4fc); text-decoration: underline; }
  }

  .Actions {
    display: flex;
    gap: 0.5em;
    margin-bottom: 0.25em;
    .Button { flex: 1; justify-content: center; margin-right: 0; text-align: center; }
  }

  .Divider {
    display: flex;
    align-items: center;
    gap: 0.75em;
    margin: 1.25em 0;
    color: var(--text-muted, rgba(232,232,255,0.3));
    font-size: 0.8rem;
    &::before, &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border, rgba(99,102,241,0.12));
    }
  }

  .GuestBtn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    padding: 0.65em 1em;
    border-radius: var(--radius-sm, 10px);
    border: 1px solid var(--border-hover, rgba(99,102,241,0.35));
    background: rgba(99,102,241,0.06);
    color: var(--text-secondary, rgba(232,232,255,0.55));
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 200ms;
    &:hover {
      background: rgba(99,102,241,0.12);
      border-color: var(--accent, #6366f1);
      color: var(--text-primary, #e8e8ff);
    }
  }

  .LoaderRow {
    display: flex;
    justify-content: center;
    margin-top: 1em;
  }

  @media (max-width: 480px) {
    padding: 2em 1.25em;
    border-radius: var(--radius-lg, 20px);
    .CardTitle { font-size: 1.3rem; }
  }
`;

export default Login;
