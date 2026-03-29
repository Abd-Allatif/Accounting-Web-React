import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from './Button';

const TopBar = React.forwardRef(({ drawerButton_Onclick, backButton_Onclick, Text, buttonText, ...props }, ref) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const goMathNotes = () => navigate("/math-notes");

    return (
      <TopBarStyle>
        <header>
          <div className="TopBar">
            <div className="DrawerContainer">
              <Button className="Drawerbtn" onClick={drawerButton_Onclick}>
                <svg className="DrawerSvg" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="45" height="45" viewBox="0 0 40 40" fill="white">
                  <path d="M 4 15 A 2.0002 2.0002 0 1 0 4 19 L 44 19 A 2.0002 2.0002 0 1 0 44 15 L 4 15 z M 4 29 A 2.0002 2.0002 0 1 0 4 33 L 44 33 A 2.0002 2.0002 0 1 0 44 29 L 4 29 z"></path>
                </svg>
              </Button>
              <Button className="MathNotes" onClick={goMathNotes}>
                <svg className="MathSvg" width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" strokeWidth="3" stroke="#000000" fill="none">
                  <path d="M14.84,11.08H48.28a5,5,0,0,1,5,5V49.53a5,5,0,0,1-5,5H14.84a5,5,0,0,1-5-5V16.08A5,5,0,0,1,14.84,11.08Z" strokeLinecap="round" />
                  <line x1="20.8" y1="18.15" x2="20.8" y2="26.5" strokeLinecap="round" />
                  <line x1="16.63" y1="22.32" x2="24.98" y2="22.32" strokeLinecap="round" />
                  <line x1="17.37" y1="40.37" x2="24.08" y2="47.08" strokeLinecap="round" />
                  <line x1="17.37" y1="47.08" x2="24.08" y2="40.37" strokeLinecap="round" />
                  <line x1="37.8" y1="22.32" x2="47.28" y2="22.32" strokeLinecap="round" />
                  <line x1="37.74" y1="40.37" x2="47.22" y2="40.37" strokeLinecap="round" />
                  <line x1="37.74" y1="46.22" x2="47.22" y2="46.22" strokeLinecap="round" />
                  <line x1="31.57" y1="11.08" x2="31.57" y2="54.53" strokeLinecap="round" />
                  <line x1="9.84" y1="32.8" x2="53.29" y2="32.8" strokeLinecap="round" />
                </svg>
              </Button>
            </div>
            <h2 className="TopBarText">{Text}</h2>
            <Button className="backbtn" onClick={backButton_Onclick}>{buttonText ? buttonText : t("back")}</Button>
          </div>
        </header>
      </TopBarStyle>
    );
  }
);
TopBar.displayName = "TopBar";

const TopBarStyle = styled.div`
  header { margin-bottom: 3.7em; }
  .TopBar {
    display: flex; flex-direction: row; position: fixed; top: 0; left: 0; z-index: 1000;
    justify-content: space-between; align-items: center; background-color: #171717;
    padding: 0.01em 0 0.2em; transition: 0.4s ease-in-out; width: 100vw; height: 65px;
  }
  .TopBarText { flex-grow: 1; color: white; text-align: center; font-size: 20px; }
  .Drawerbtn {
    margin-right: 1em; margin-bottom: 0.1em; padding: 1em; border: none; background-color: transparent;
    &.Drawerbtn:hover { background: none; }
    &.Drawerbtn:hover .DrawerSvg { transition: 0.4s ease; fill: #222222; }
  }
  .backbtn { margin-left: 1em; margin-right: 1em; }
  .MathNotes {
    margin: -0.1em -1em 0.1em -1em; padding-top: 1em; border: none; background-color: transparent;
    &.MathNotes:hover { background: none; }
    .MathSvg { stroke: white; }
    &.MathNotes:hover .MathSvg { transition: 0.4s ease; stroke: rgb(0, 0, 0); }
  }
  .DrawerContainer { display: flex; align-items: center; justify-content: center; }
  @media (max-width: 768px) { .MathSvg { margin-left: -1em; margin-right: -1em; } .DrawerContainer { margin-left: -0.5em; margin-right: -0.5em; } }
`;

export default TopBar;
