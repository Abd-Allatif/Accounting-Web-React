import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { commonInputStyles, commonButtonStyles } from '../styles/SharedStyles';

const SearchField = React.forwardRef(({ onClick, value, onChange }, ref) => {
  const { t } = useTranslation();
  return (
    <SearchFieldStyle>
      <div className="FilterContainer">
        <svg width="35px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#d3d3d3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <input type="text" className="Search" placeholder={t("search")} value={value} onChange={onChange} />
        <button className="SearchBtn" onClick={onClick}>{t("refresh")}</button>
      </div>
    </SearchFieldStyle>
  );
});
SearchField.displayName = "SearchField";

const SearchFieldStyle = styled.div`
  .FilterContainer {
    ${commonInputStyles}
    display: flex; align-items: center; justify-content: space-between; gap: 0.5em;
    padding: 0.6em 0.5em; width: 85vw; height: 6vh;
    .Search {
      background: none; border: none; outline: none; width: 100%; color: #d3d3d3; padding: 0.5em;
    }
    .SearchBtn { ${commonButtonStyles} padding: 0.2em 0.5em; border-radius: 15px; }
  }
  @media (max-width: 768px) { .FilterContainer { padding: 1.5em 0.2em; width: 73vw; } }
`;

export default SearchField;
