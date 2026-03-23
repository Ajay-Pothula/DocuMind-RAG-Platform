import fitz  # PyMuPDF
from fastapi import UploadFile
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.services.vector_store import add_texts
from app.services.aws_service import upload_file_to_s3

async def process_pdf(file: UploadFile) -> str:
    """
    Reads a raw uploaded PDF file, extracts the text using PyMuPDF,
    chunks the text via LangChain, and inserts the chunks into the Vector Store.
    """
    # 1. Read PDF bytes into memory
    content = await file.read()
    
    # 2. Extract Text using PyMuPDF (fitz)
    text = ""
    # fitz.Document can read from a byte stream
    with fitz.open(stream=content, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
            
    if not text.strip():
        return "Warning: The PDF appeared to be empty or contained only images."

    # --- NEW: Upload to AWS S3 (for Amazon Portfolio) ---
    s3_url = upload_file_to_s3(content, file.filename)
    if s3_url:
        print(f"File successfully backed up to AWS S3: {s3_url}")
    else:
        print("Warning: AWS S3 upload failed. Check your credentials.")

    # 3. Chunk the document. 1000 characters per chunk, with a 200 char overlap 
    # to maintain context between paragraphs.
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    
    chunks = text_splitter.split_text(text)
    
    # 4. Prepare data for ChromaDB
    # We must provide IDs for every chunk so the DB can track them.
    ids = [f"{file.filename}-chunk-{i}" for i in range(len(chunks))]
    metadatas = [{"source": file.filename, "chunk": i} for i in range(len(chunks))]
    
    # Send directly to the vector_store.py service we built
    add_texts(texts=chunks, metadatas=metadatas, ids=ids)
    
    return f"Successfully processed {file.filename} into {len(chunks)} searchable chunks!"
