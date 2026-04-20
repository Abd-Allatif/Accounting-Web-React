import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { commonInputStyles, commonButtonStyles } from '../styles/SharedStyles';

const SearchField = React.forwardRef(({ onClick, value, onChange }, ref) => {
  const { t } = useTranslation();
  return (
    <SearchFieldStyle>
      <div className="FilterContainer">
        <svg className="SearchIcon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <input
          ref={ref}
          type="text"
          className="Search"
          placeholder={t('search')}
          value={value}
          onChange={onChange}
        />
        <button className="RefreshBtn" onClick={onClick}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('refresh')}
        </button>
      </div>
    </SearchFieldStyle>
  );
});
SearchField.displayName = 'SearchField';

const SearchFieldStyle = styled.div`
  .FilterContainer {
    ${commonInputStyles}
    display: flex;
    align-items: center;
    gap: 0.75em;
    padding: 0.55em 0.9em;
    width: 85vw;
    min-height: 48px;
  }

  .SearchIcon {
    color: var(--text-accent, #818cf8);
    opacity: 0.7;
    flex-shrink: 0;
  }

  .Search {
    background: none;
    border: none;
    outline: none;
    width: 100%;
    color: var(--text-primary, #e8e8ff);
    font-family: var(--font-sans, 'Inter', sans-serif);
    font-size: 0.9rem;
    &::placeholder {
      color: var(--text-muted, rgba(232,232,255,0.3));
    }
  }

  .RefreshBtn {
    ${commonButtonStyles}
    display: flex;
    align-items: center;
    gap: 0.35em;
    padding: 0.35em 0.85em;
    border-radius: var(--radius-full, 9999px);
    font-size: 0.8rem;
    white-space: nowrap;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .FilterContainer { width: 82vw; padding: 0.55em 0.6em; }
    .RefreshBtn span { display: none; }
  }
`;

export default SearchField;
