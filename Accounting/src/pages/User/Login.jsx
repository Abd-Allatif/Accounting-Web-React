import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader, BackGround, Card, InputField, Button } from '../../components';
import { login, guestLogin } from '../../services/authService';
import { useTranslation } from "react-i18next";
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
      await login(identifier, password, () => { refreshAuth(); navigate("/main"); }, () => { refreshAuth(); navigate("/setup-account"); });
      setLoading(false);
    } catch (error) {
      window.alert('Invalid Credentials');
      setLoading(false);
    }
  };

  return (
    <StyledWrapper>
      <BackGround>
        <Card className="ItemsContainer">
          <p id="heading">{t("login")}</p>
          <div className='InputContainer'>
            <InputField placeholder={t("emailOrUserName")} type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value.toLowerCase())} />
            <InputField placeholder={t("password")} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="ButtonContainer">
            <Button onClick={submitData}>{t("login")}</Button>
            <Button onClick={() => navigate('/register')}>{t("signUp")}</Button>
          </div>
          <div className="ButtonContainer2">
            <Button onClick={handleGuestLogin}>Guest Demo Login</Button>
          </div>
          <div className='Loader'>{loading && <Loader width='3' height='20' animateHeight='36' />}</div>
        </Card>
      </BackGround>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .InputContainer { margin-top: 25px; }
  #heading { text-align: center; margin: 2em; color: white; font-size: 1.2em; }
  .ItemsContainer { height: 550px; }
  .ButtonContainer, .ButtonContainer2 { display: flex; justify-content: center; margin-top: 2em; }
  .Loader { align-self: center; }
`;

export default Login;
