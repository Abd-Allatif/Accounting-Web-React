import styled from 'styled-components';
import { BackGround } from '../../components';

function NotFound() {
    return (
        <StyledWrapper>
            <BackGround className="Container">
                <div className="Content">
                    <h1>404 - Page Not Found</h1>
                    <button className="GoHome" onClick={() => window.location.href = '/'}>Go Home</button>
                </div>
            </BackGround>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .Container { display: flex; align-items: center; justify-content: center; height: 100vh; }
  .Content { text-align: center; color: white; }
`;

export default NotFound;
