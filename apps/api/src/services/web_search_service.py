"""
Web Search Service
Allows Luminas to browse and search for information
"""

import httpx
from typing import List, Dict, Optional
from core.logger import logger
from core.config import settings

class WebSearchService:
    """
    Service for web searching - enhances Luminas with real-time data
    """

    def __init__(self):
        # Search API options (can be changed)
        self.search_api = settings.WEB_SEARCH_API or "google"  # Options: google, duckduckgo, searx

    async def search(self, query: str, num_results: int = 5) -> List[Dict]:
        """
        Search the web for information

        Args:
            query: Search query
            num_results: Number of results to return

        Returns:
            List of search results
        """
        try:
            logger.info(f"🔍 Searching web for: {query}")

            # Build search URL based on API
            if self.search_api == "google":
                search_url = f"https://www.googleapis.com/customsearch/v1"
                # Note: Google Custom Search API needs API key
                # For demo, we'll use a simpler approach
                results = await self._search_duckduckgo(query, num_results)

            elif self.search_api == "duckduckgo":
                results = await self._search_duckduckgo(query, num_results)
            else:
                results = await self._search_duckduckgo(query, num_results)

            logger.info(f"✅ Search complete: {len(results)} results")
            return results

        except Exception as e:
            logger.error(f"Search error: {e}")
            return []

    async def _search_duckduckgo(self, query: str, num_results: int) -> List[Dict]:
        """
        Search using DuckDuckGo Instant Answer API
        Free, no API key required
        """
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    "https://api.duckduckgo.com/",
                    params={
                        "q": query,
                        "format": "json",
                        "no_html": "1",
                        "skip_disambig": "1"
                    }
                )

                if response.status_code == 200:
                    data = response.json()

                    # Parse abstract (main answer)
                    abstract = data.get("AbstractText", "")
                    if abstract:
                        results = [{
                            "title": "Answer",
                            "url": "",
                            "snippet": abstract,
                            "source": "DuckDuckGo Instant Answer"
                        }]
                    else:
                        # Get related topics
                        related = data.get("RelatedTopics", [])
                        results = [{
                            "title": topic.get("Text", topic.get("FirstURL")),
                            "url": topic.get("FirstURL"),
                            "snippet": "",
                            "source": "DuckDuckGo"
                        } for topic in related[:num_results]]

                    return results
                else:
                    logger.error(f"DuckDuckGo API error: {response.status_code}")
                    return []

        except Exception as e:
            logger.error(f"DuckDuckGo search error: {e}")
            return []

    async def get_page_content(self, url: str) -> str:
        """
        Fetch and extract content from a URL

        Args:
            url: URL to fetch

        Returns:
            Page content as text
        """
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(url)

                if response.status_code == 200:
                    # Simple text extraction (in production, use proper parser)
                    content = response.text

                    # Remove HTML tags (simple approach)
                    import re
                    text = re.sub(r'<[^>]+>', '', content)
                    text = ' '.join(text.split())

                    return text[:2000]  # Limit content length
                else:
                    logger.error(f"Failed to fetch {url}: {response.status_code}")
                    return ""

        except Exception as e:
            logger.error(f"Content fetch error: {e}")
            return ""

    async def search_and_read(self, query: str) -> Dict:
        """
        Search for information and read top result

        Args:
            query: Search query

        Returns:
            Dict with search results and top result content
        """
        try:
            # Search
            results = await self.search(query, num_results=1)

            if results and len(results) > 0:
                top_result = results[0]

                # Read top result
                content = ""
                if top_result.get("url"):
                    content = await self.get_page_content(top_result["url"])

                return {
                    "query": query,
                    "results": results,
                    "top_result": top_result,
                    "content_preview": content,
                }
            else:
                return {
                    "query": query,
                    "results": [],
                    "error": "No results found"
                }

        except Exception as e:
            logger.error(f"Search and read error: {e}")
            return {
                "query": query,
                "results": [],
                "error": str(e)
            }

# Global instance
web_search_service = WebSearchService()
