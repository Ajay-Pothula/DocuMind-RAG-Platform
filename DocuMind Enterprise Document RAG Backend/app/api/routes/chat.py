"""
api/routes/chat.py
"""

from fastapi import APIRouter, HTTPException

from app.models.request_models import ChatRequest
from app.models.response_models import ChatResponse, ChatCitation
from app.services.llm_service import ask_llm

router = APIRouter()

@router.post(
    "/ai/chat",
    response_model=ChatResponse,
    summary="Chat with the LLM",
    description="Send a prompt with optional history and receive an AI-generated response plus citations.",
)
def chat(request: ChatRequest) -> ChatResponse:
    try:
        reply, metadatas = ask_llm(prompt=request.prompt, history=request.history)
        
        # Format citations
        citations = []
        for meta in metadatas:
            if meta and "source" in meta:
                citations.append(ChatCitation(
                    source=meta["source"], 
                    chunk=int(meta.get("chunk", 0))
                ))

        return ChatResponse(response=reply, citations=citations)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {exc}",
        )
