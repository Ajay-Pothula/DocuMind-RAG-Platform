// src/services/api.js

const API_BASE_URL = 'http://localhost:8000';

export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
};

export const fetchDocuments = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/documents/list`);
        if (!response.ok) throw new Error(`Fetch docs failed: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Fetch Docs Error:', error);
        throw error;
    }
};

export const deleteDocument = async (filename) => {
    try {
        const response = await fetch(`${API_BASE_URL}/documents/${filename}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Delete Error:', error);
        throw error;
    }
}

export const chatWithAI = async (message, history = []) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
          prompt: message,
          history: history 
      }), 
    });

    if (!response.ok) throw new Error(`Chat failed: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Chat Error:', error);
    throw error;
  }
};
