# DocuMind AI: Full-Stack Enterprise RAG Platform

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![ChromaDB](https://img.shields.io/badge/ChromaDB-FF6B6B?style=for-the-badge)
![Groq](https://img.shields.io/badge/Groq-000000?style=for-the-badge&logo=ai)

An end-to-end full-stack Retrieval-Augmented Generation (RAG) platform that enables users to upload, manage, and interactively query large PDF documents. This system acts as a stateful, highly intelligent document assistant.

## Features
- **Semantic Search Engine:** Ingests and chunks 100+ page PDF documents into highly optimized embeddings using HuggingFace sentence models.
- **Stateful Vector Persistence:** Utilizes ChromaDB to retain document embeddings across active sessions. You don't have to re-process historical PDFs.
- **Lightening-Fast AI:** Integrates Groq LLM API to deliver hallucination-free, highly accurate generative answers with sub-second retrieval latency.
- **RESTful Architecture:** Features an asynchronous FastAPI backend for full lifecycle management of vectorized documents (POST/DELETE operations).
- **Responsive UI:** A dynamic React-based frontend providing a seamless, real-time ChatGPT-like user experience.

---

## 📂 Repository Structure

This is a mono-repo containing both the React Frontend and the FastAPI Backend.

```text
DocuMind/
│
├── frontend/           # React + Vite User Interface
│   ├── src/
│   ├── package.json
│   └── ...
│
└── backend/            # Python FastAPI + LangChain Server
    ├── app/
    ├── requirements.txt
    └── ...
```

---

## 🚀 Getting Started

To run this application, you will need to start both the `backend` and `frontend` servers in two separate terminal windows.

### 1. Build and Run the Backend (FastAPI)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. **Environment Variables:** Create a `.env` file in the `backend` root directory and add your Groq API Key:
   ```env
   GROQ_API_KEY=your_api_key_here
   ```
5. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The backend API will be live at `http://localhost:8000`. You can view interactive API documentation at `http://localhost:8000/docs`.*

### 2. Build and Run the Frontend (React)

1. Open a **second, new terminal window** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary Node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The stunning UI will be live at `http://localhost:5173/`.*

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React, Vite, CSS
- **Backend API:** FastAPI, Uvicorn, Python
- **AI & ML Pipeline:** LangChain, PyMuPDF (PDF ingestion), SentenceTransformers (Embeddings)
- **Vector Database:** ChromaDB
- **LLM Interface:** Groq API

## 📝 Usage

1. Open the UI at `http://localhost:5173/`
2. Use the left sidebar to **Upload** your target PDF document.
3. Once the document chunks are vectorized and stored in ChromaDB, ask natural language questions in the main Chat Area to interrogate your document natively!
