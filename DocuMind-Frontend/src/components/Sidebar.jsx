// src/components/Sidebar.jsx
import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, CheckCircle, FileText, Trash2 } from 'lucide-react';
import { uploadPDF, fetchDocuments, deleteDocument } from '../services/api';
import './Sidebar.css'; 

export default function Sidebar({ onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState([]);

  const loadDocuments = async () => {
      try {
          const data = await fetchDocuments();
          if (data && data.documents) {
              setDocuments(data.documents);
          }
      } catch (err) {
          console.error(err);
      }
  };

  useEffect(() => {
      loadDocuments();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const data = await uploadPDF(file);
      await loadDocuments(); // Refresh the list from the database
      if (onUploadSuccess) onUploadSuccess(data);
    } catch (err) {
      console.error(err);
      alert("Failed to upload PDF. Is the backend running at localhost:8000?");
    } finally {
      setIsUploading(false);
      e.target.value = null; // Reset input field so same file can be clicked again
    }
  };

  const handleDelete = async (filename) => {
      try {
          await deleteDocument(filename);
          await loadDocuments(); // Refresh the list
      } catch (err) {
          alert(`Failed to delete ${filename}`);
      }
  };

  return (
    <aside className="sidebar glass">
      <div className="sidebar-header">
        <h2 className="brand-logo">Docu<span className="text-accent">Mind</span></h2>
      </div>

      <div className="upload-container">
        <input 
          type="file" 
          accept="application/pdf" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />
        <div 
          className="upload-dropzone glass"
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="uploading-state">
              <UploadCloud className="icon animate-pulse" size={32} />
              <p>Uploading...</p>
            </div>
          ) : (
            <div className="initial-state animate-fade-in">
              <UploadCloud className="icon" size={32} color="var(--accent-color)" />
              <p>Click to upload PDF</p>
            </div>
          )}
        </div>
      </div>
      
      {documents.length > 0 && (
          <div className="document-list animate-fade-in">
              <h3 className="section-title">Active Documents</h3>
              <div className="docs-container">
                  {documents.map((doc, idx) => (
                      <div key={idx} className="doc-item glass">
                          <FileText size={16} color="var(--accent-color)" />
                          <span className="doc-name" title={doc}>{doc}</span>
                          <button className="del-btn" onClick={() => handleDelete(doc)} title="Remove document">
                              <Trash2 size={16} color="var(--error-color)" />
                          </button>
                      </div>
                  ))}
              </div>
          </div>
      )}

      <div className="sidebar-footer">
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span>System Online</span>
        </div>
      </div>
    </aside>
  );
}
