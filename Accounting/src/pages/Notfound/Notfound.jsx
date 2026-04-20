import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { BackGround, Card, Button } from '../../components';
import { useTranslation } from 'react-i18next';

function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <StyledWrapper>
      <BackGround className="Container">
        <Card className="ItemsContainer">
          <h1 className="Title">404</h1>
          <p className="Subtitle">Page Not Found</p>
          <Button className="GoHomeBtn" onClick={() => navigate('/')}>Go Home</Button>
        </Card>
      </BackGround>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .Container{display:flex;align-items:center;justify-content:center;min-height:100vh;}
  .ItemsContainer{width:30vw;min-height:30vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5em;text-align:center;}
  .Title{font-size:4rem;font-weight:800;background:linear-gradient(135deg,var(--text-primary),var(--text-secondary));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:0;}
  .Subtitle{font-size:1.2rem;color:var(--text-secondary);margin:0;}
  .GoHomeBtn{margin-top:1em;min-width:150px;}
  @media(max-width:768px){.ItemsContainer{width:80vw;}}
`;

export default NotFound;
