"""
Web Search API Endpoints
Allows Luminas to browse and search for real-time information
"""

from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, Field
from typing import Optional, Literal

from services.web_search_service import web_search_service
from core.logger import logger

router = APIRouter()


class SearchRequest(BaseModel):
    """Request for web search"""
    query: str = Field(..., min_length=2, description="Search query")
    num_results: int = Field(5, ge=1, le=10, description="Number of results")
    read_content: bool = Field(False, description="Read top result content")


class SearchResponse(BaseModel):
    """Response for web search"""
    query: str
    results: list
    top_result: Optional[dict] = None
    content_preview: Optional[str] = None
    error: Optional[str] = None


@router.post("/web")
async def web_search(request: SearchRequest) -> SearchResponse:
    """
    Search the web for information

    - **query**: Search query
    - **num_results**: Number of results (1-10)
    - **read_content**: Whether to fetch top result content

    Returns search results with optional content preview
    """
    try:
        logger.info(f"Web search request: {request.query}")

        if request.read_content:
            # Search and read top result
            result = await web_search_service.search_and_read(request.query)
            return result
        else:
            # Search only
            results = await web_search_service.search(request.query, request.num_results)
            return {
                "query": request.query,
                "results": results,
                "top_result": None,
                "content_preview": None,
                "error": None
            }

    except Exception as e:
        logger.error(f"Web search error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status")
async def search_status():
    """
    Get web search service status
    """
    return {
        "available": True,
        "api": "duckduckgo",
        "features": [
            "instant_answers",
            "related_topics",
            "content_fetching"
        ]
    }


@router.post("/summarize_url")
async def summarize_url(url: str = Body(..., description="URL to summarize")):
    """
    Fetch and summarize content from a URL

    - **url**: URL to fetch and summarize

    Returns summarized content
    """
    try:
        # Fetch content
        content = await web_search_service.get_page_content(url)

        if not content:
            raise HTTPException(status_code=400, detail="Could not fetch content")

        # Simple summarization (can be improved with AI)
        sentences = content.split('.')
        summary = '. '.join(sentences[:5])  # First 5 sentences

        return {
            "url": url,
            "content_preview": content[:500],
            "summary": summary,
            "word_count": len(content.split())
        }

    except Exception as e:
        logger.error(f"URL summarization error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/features")
async def search_features():
    """Get available search features"""
    return {
        "search_apis": {
            "duckduckgo": {
                "available": True,
                "description": "Free, no API key required",
                "features": ["instant_answers", "privacy"]
            },
            "google": {
                "available": False,
                "description": "Requires API key",
                "note": "Set WEB_SEARCH_API=google in .env"
            }
        },
        "capabilities": [
            "web_search",
            "url_summarization",
            "real_time_data",
            "no_api_key_required"
        ]
    }
