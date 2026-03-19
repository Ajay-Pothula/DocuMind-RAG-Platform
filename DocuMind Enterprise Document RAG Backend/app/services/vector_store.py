import os
import chromadb
from chromadb.utils import embedding_functions

# Path to the persistent database
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "chroma_db")

# Initialize the ChromaDB client with persistent storage
client = chromadb.PersistentClient(path=DB_PATH)

# Use the Sentence-Transformers embedding model
# all-MiniLM-L6-v2 is fast, lightweight, and perfect for CPU/laptop execution
embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")

# Create or get the collection where our document parts (chunks) will be stored
collection = client.get_or_create_collection(
    name="documind_vectors",
    embedding_function=embedding_function
)

def add_texts(texts: list[str], metadatas: list[dict], ids: list[str]):
    """
    Adds text chunks into ChromaDB. 
    It automatically vectorizes them using the embedding_function.
    """
    collection.add(
        documents=texts,
        metadatas=metadatas,
        ids=ids
    )

def search_similar(query: str, n_results: int = 3) -> list[str]:
    """Legacy endpoint, returning only document text."""
    results = collection.query(
        query_texts=[query],
        n_results=n_results
    )
    if results['documents']:
        return results['documents'][0]
    return []

def search_similar_with_metadata(query: str, n_results: int = 3):
    """
    Returns text chunks AND metadata (for citations) from DB.
    """
    results = collection.query(
        query_texts=[query],
        n_results=n_results
    )
    if results['documents']:
        return results['documents'][0], results['metadatas'][0]
    return [], []

def get_all_documents():
    """Gets all unique document filenames stored in ChromaDB."""
    results = collection.get()
    if not results or not results.get("metadatas"):
        return []
    
    unique_sources = set()
    for meta in results["metadatas"]:
        if meta and "source" in meta:
            unique_sources.add(meta["source"])
    return list(unique_sources)

def delete_document(filename: str):
    """Deletes all chunks associated with a specific document source metadata."""
    collection.delete(where={"source": filename})
