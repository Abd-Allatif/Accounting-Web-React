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
  const {t} = useTranslation();

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
    if (!selectedFile) {
      setError(t("excelerror1"));
      return;
    }
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
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${newAccessToken}`,
          }
        }
      );
      setUploadStatus(t("importedDataSuccess"));
    } catch (err) {
      setError(err.response?.data?.error || t("uploadFailed"));
    } finally {
      setIsUploading(false);
      setTimeout(() => { setUploadStatus(''); setError(''); }, 10000);
    }
  };

  return (
    <UploaderStyle>
      <div className="upload-container">
        <input type="file" id="excel-upload" accept=".xlsx, .xls" onChange={handleFileSelect} style={{ display: 'none' }} />
        <label htmlFor="excel-upload" className="upload-button">{selectedFile ? selectedFile.name : t("chooseExcelFile")}</label>
        {selectedFile && <button onClick={handleUpload} disabled={isUploading} className="upload-submit-button">{isUploading ? t("uploading") : t("uploadData")}</button>}
        {uploadStatus && <div className="upload-status success">{uploadStatus}</div>}
        {error && <div className="upload-status error">{error}</div>}
      </div>
    </UploaderStyle>
  );
};

const UploaderStyle = styled.div`
  .upload-button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; border-radius: 4px; cursor: pointer; }
  .upload-submit-button { padding: 10px 20px; background-color: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top:10px; }
  .upload-status { display:inline; margin-left:10px; padding: 10px; border-radius: 4px; }
  .success { color: #3c763d; }
  .error { color: #a94442; }
`;

export default ExcelUploader;
