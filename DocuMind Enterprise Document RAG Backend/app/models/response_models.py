"""
models/response_models.py
-------------------------
Pydantic models that describe the shape of API responses.
"""

from pydantic import BaseModel, Field
from typing import List

class ChatCitation(BaseModel):
    source: str
    chunk: int

class ChatResponse(BaseModel):
    """Response returned by the /ai/chat endpoint."""

    response: str = Field(
        ...,
        description="The assistant's reply from the LLM.",
    )
    citations: List[ChatCitation] = Field(
        default_factory=list,
        description="List of document citations used out of the vector database."
    )

class HealthResponse(BaseModel):
    """Response returned by the /health endpoint."""

    status: str = Field(
        ...,
        description="Current server status.",
        examples=["ok"],
    )
    message: str = Field(
        ...,
        description="Human-readable status message.",
        examples=["GenAI FastAPI backend is running."],
    )
