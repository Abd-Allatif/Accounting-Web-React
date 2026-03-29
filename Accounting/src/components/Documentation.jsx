import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { commonCardStyles, scrollbarStyles } from '../styles/SharedStyles';
import Button from './Button';

const Documentation = React.forwardRef(({docOpen,setDocOpen}) => {
  const { t } = useTranslation();
  const closebtn = () => setDocOpen(false);
  return (
    <ContentContainer>
      {docOpen && (
        <div className="Back">
          <p className="Title">{t("DocumentationTitle")}</p>
          <p className="Doc1 text-red-600">{t("Doc10")}</p>
          {[1,2,3,4,5,6,7].map(n => <p key={n} className="Doc">{t(`Doc${n}`)}</p>)}
          <p className="Doc1 text-red-500">{t("Doc11")}</p>
          <p className="Doc1 text-white">{t("Doc12")}</p>
          <p className="Doc1 text-blue-400">{t("Doc8")}</p>
          <p className="Doc1 text-blue-500">{t("Doc9")}</p>
          <div className="btnContainer"><Button onClick={closebtn}>{t("close")}</Button></div>
        </div>
      )}
    </ContentContainer>
  );
});
Documentation.displayName = "Documentation";

const ContentContainer = styled.div`
  .Back {
    ${commonCardStyles}
    ${scrollbarStyles}
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 700px; height: 500px; overflow-y: auto;
    z-index: 1001;
    @media (min-width: 768px) and (max-width: 1024px) { width: 80vw; height: 55vh; }
    @media (max-width: 768px) { margin: 1.3em; width: 75vw; height: 70vh; }
  }
  .Title { color: white; font-size: 30px; text-align: center; margin-top: 30px; }
  .Doc, .Doc1 { color: white; font-size: 18px; margin: 8px; }
  .btnContainer { display: flex; justify-content: center; margin: 10px 0; }
`;

export default Documentation;
