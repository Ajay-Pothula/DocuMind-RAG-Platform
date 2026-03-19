# DocuMind: Enterprise Document RAG Backend

DocuMind is a production-grade **Retrieval-Augmented Generation (RAG)** pipeline built on top of **FastAPI**. It allows enterprises to securely upload raw PDF documents, instantly vectorize their knowledge into **ChromaDB**, and chat directly with that corporate knowledge using the **Groq LLM API**.

This acts as a high-leverage ML Engineering portfolio project demonstrating Applied NLP, Vector Space Search, and intelligent Agentic Architecture.

---

## Architecture Flow

1. **Ingestion (`POST /documents/upload`)**
   - Receives raw `.pdf` files.
   - Parses pure text via the highly-performant `PyMuPDF` engine.
   - Splits document text using `langchain`'s `RecursiveCharacterTextSplitter`.
   - Embeds the chunks using `sentence-transformers` (`all-MiniLM-L6-v2`) and saves them persistently to an onboard **ChromaDB**.

2. **Generation (`POST /ai/chat`)**
   - Receives a user's prompt.
   - Converts the prompt into a semantic vector and searches ChromaDB for the Top-K matching corporate knowledge chunks.
   - Injects the proprietary context directly into the Groq LLM `system` prompt securely.
   - Returns an intelligent, hallucination-free answer.

---

## Installation & Setup

Before you begin, ensure you have **Python 3.9+** installed.

### 1. Create a Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate
```

### 2. Install the RAG Dependencies

```bash
pip install fastapi uvicorn pydantic requests python-dotenv langchain chromadb PyMuPDF sentence-transformers
```

### 3. Configure the Environment

Create a `.env` file in the root folder and add your Groq API Key:

```env
GROQ_API_KEY=gsk_your_actual_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
GROQ_BASE_URL=https://api.groq.com/openai/v1/chat/completions
```

> Get a free, blazing-fast inference API key at [console.groq.com](https://console.groq.com)

---

## Running the Server

Make sure your virtual environment is activated (`venv\Scripts\activate`), then run:

```bash
uvicorn app.main:app --reload --port 8001
```

The RAG backend is now live at **http://localhost:8001**.
The ChromaDB persistent Vector Store will automatically be initialized inside `/app/data/chroma_db`.

---

## Interacting with the Pipeline (Swagger UI)

Navigate to **http://localhost:8001/docs** to test the full pipeline directly in your browser.

### Step 1: Upload a PDF to the Vector Database
1. Expand the green **`POST /documents/upload`** box.
2. Click **"Try it out"**.
3. Choose a `.pdf` file from your device (e.g., a company handbook, resume, or manual).
4. Click **Execute**. The system will silently slice it and embed it into Chroma.

### Step 2: Chat with your Document
1. Expand the green **`POST /ai/chat`** box.
2. Click **"Try it out"**.
3. Ask a question regarding the PDF you just uploaded:
```json
{
  "prompt": "What are the core requirements listed in this resume?"
}
```
4. Click **Execute** to see the contextualized AI response!
