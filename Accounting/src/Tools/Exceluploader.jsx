import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { refreshAccessToken } from './authService'


const ExcelUploader = ({ username }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      setUploadStatus('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    try {
      setIsUploading(true);
      setError('');
      setUploadStatus('Uploading...');
  
      const newAccessToken = await refreshAccessToken();
  
      // Updated endpoint URL to match corrected Django URL
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL_DATA_IMPORT}/${username}/`,  
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${newAccessToken}`,
          }
        }
      );
  
      if (response.data.results) {
        const successSheets = Object.values(response.data.results).filter(
          sheet => sheet.status === 'success'
        ).length;
        
        const totalImported = Object.values(response.data.results)
          .filter(sheet => sheet.status === 'success')
          .reduce((sum, sheet) => sum + (sheet.count || 0), 0);
  
        setUploadStatus(`Imported ${totalImported} items across ${successSheets} sheets`);
      }
  
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.results?.[0]?.message || 
                          'Upload failed';
      setError(errorMessage);
      
    } finally {
      setIsUploading(false);
      setUploadStatus('');
      setTimeout(() => {
        setUploadStatus('');
        setError('');
      }, 10000);
    }
  };

  return (
    <UploaderStyle>
      <div className="upload-container">
        <div className="file-input-wrapper">
          <input
            type="file"
            id="excel-upload"
            accept=".xlsx, .xls"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <label htmlFor="excel-upload" className="upload-button">
            {selectedFile ? selectedFile.name : 'Choose Excel File'}
          </label>
        </div>

        {selectedFile && (
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="upload-submit-button"
          >
            {isUploading ? 'Uploading...' : 'Upload Data'}
          </button>
        )}

        {uploadStatus && <div className="upload-status success">{uploadStatus}</div>}
        {error && <div className="upload-status error">{error}</div>}
      </div>
    </UploaderStyle>
  );
};

const UploaderStyle = styled.div`
  .upload-container {
          max-width: 500px;
          border-radius: 8px;
        }

        .file-input-wrapper {
         
        }

        .upload-button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .upload-button:hover {
          background-color: #45a049;
        }

        .upload-submit-button {
          padding: 10px 20px;
          background-color: #2196F3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top:10px;
          transition: background-color 0.3s;
        }

        .upload-submit-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }

        .upload-submit-button:hover:not(:disabled) {
          background-color: #1976D2;
        }

        .upload-status {
          display:inline;
          margin-top: 10px;
          margin-left:10px;
          padding: 10px;
          border-radius: 4px;
        }

        .success {
          color: #3c763d;
        }

        .error {
          margin-top:5px;
          color: #a94442;
        }
`;

export default ExcelUploader;