import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { refreshAccessToken } from '../services/authService';
import { useTranslation } from 'react-i18next';

const ExcelUploader = ({ username }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { t } = useTranslation();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      setUploadStatus('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) { setError(t('excelerror1')); return; }
    const formData = new FormData();
    formData.append('file', selectedFile);
    setIsUploading(true);
    setError('');
    setUploadStatus('Uploading...');

    try {
      const newAccessToken = await refreshAccessToken();
      await axios.post(
        `${import.meta.env.VITE_API_URL_DATA_IMPORT}/${username}/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${newAccessToken}` } }
      );
      setUploadStatus(t('importedDataSuccess'));
    } catch (err) {
      setError(err.response?.data?.error || t('uploadFailed'));
    } finally {
      setIsUploading(false);
      setTimeout(() => { setUploadStatus(''); setError(''); }, 10000);
    }
  };

  return (
    <UploaderStyle>
      <div className="upload-container">
        <input type="file" id="excel-upload" accept=".xlsx, .xls" onChange={handleFileSelect} style={{ display: 'none' }} />
        <label htmlFor="excel-upload" className="upload-zone">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{selectedFile ? selectedFile.name : t('chooseExcelFile')}</span>
        </label>
        {selectedFile && (
          <button onClick={handleUpload} disabled={isUploading} className="upload-btn">
            {isUploading ? (
              <><span className="spin">⟳</span> {t('uploading')}</>
            ) : t('uploadData')}
          </button>
        )}
        {uploadStatus && <div className="status success">{uploadStatus}</div>}
        {error && <div className="status error">{error}</div>}
      </div>
    </UploaderStyle>
  );
};

const UploaderStyle = styled.div`
  .upload-container {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }

  .upload-zone {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.55em 1em;
    border: 1px dashed var(--border-hover, rgba(99,102,241,0.35));
    border-radius: var(--radius-sm, 10px);
    background: rgba(99,102,241,0.05);
    color: var(--text-accent, #818cf8);
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 150ms;
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
      border-color: var(--accent, #6366f1);
      background: rgba(99,102,241,0.1);
    }
  }

  .upload-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4em;
    padding: 0.5em 1em;
    border-radius: var(--radius-sm, 10px);
    border: none;
    background: linear-gradient(135deg, var(--emerald, #10b981), #059669);
    color: #fff;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 200ms;
    &:hover { box-shadow: 0 4px 16px rgba(16,185,129,0.35); transform: translateY(-1px); }
    &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
  }

  .spin { display: inline-block; animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .status {
    padding: 0.5em 0.75em;
    border-radius: var(--radius-xs, 6px);
    font-size: 0.82rem;
    font-weight: 500;
    &.success { background: rgba(16,185,129,0.1); color: var(--emerald, #10b981); border: 1px solid rgba(16,185,129,0.2); }
    &.error   { background: rgba(244,63,94,0.1);  color: var(--rose, #f43f5e);    border: 1px solid rgba(244,63,94,0.2); }
  }
`;

export default ExcelUploader;
