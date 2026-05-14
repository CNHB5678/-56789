import logging
import os
import httpx
from typing import List, Dict
from .base import BaseScraper, MediaItem
import uuid

logger = logging.getLogger(__name__)


class UnsplashScraper(BaseScraper):
    def __init__(self, api_key: str = None, **kwargs):
        super().__init__(name="Unsplash", **kwargs)
        self.api_key = api_key
        self.base_url = "https://api.unsplash.com"

    async def search(self, query: str, limit: int = 20) -> List[MediaItem]:
        if not self.session:
            raise RuntimeError("Scraper not initialized. Use 'async with' context manager.")

        items = []

        if self.api_key:
            items = await self._search_with_api(query, limit)
        else:
            items = await self._search_without_api(query, limit)

        return items

    async def _search_with_api(self, query: str, limit: int) -> List[MediaItem]:
        items = []
        try:
            response = await self.session.get(
                f"{self.base_url}/search/photos",
                headers={"Authorization": f"Client-ID {self.api_key}"},
                params={"query": query, "per_page": min(limit, 30)}
            )
            response.raise_for_status()
            data = response.json()

            for photo in data.get("results", []):
                item = MediaItem(
                    id=photo.get("id", str(uuid.uuid4())),
                    url=photo.get("urls", {}).get("raw", ""),
                    thumbnail_url=photo.get("urls", {}).get("thumb", ""),
                    title=photo.get("alt_description", query),
                    source="unsplash",
                    format="jpg",
                    width=photo.get("width"),
                    height=photo.get("height"),
                    tags=[tag.get("title", "") for tag in photo.get("tags", [])]
                )
                items.append(item)

        except Exception as e:
            logger.error(f"Unsplash API search failed: {e}")

        return items

    async def _search_without_api(self, query: str, limit: int) -> List[MediaItem]:
        items = []
        try:
            search_url = f"https://unsplash.com/napi/search/photos?query={query}&per_page={limit}"
            response = await self._request_with_retry(search_url)

            if not response:
                return items

            data = response.json()
            for photo in data.get("results", []):
                urls = photo.get("urls", {})
                item = MediaItem(
                    id=photo.get("id", str(uuid.uuid4())),
                    url=urls.get("raw", ""),
                    thumbnail_url=urls.get("thumb", ""),
                    title=photo.get("alt_description", query),
                    source="unsplash",
                    format="jpg",
                    width=photo.get("width"),
                    height=photo.get("height"),
                    tags=[]
                )
                items.append(item)

        except Exception as e:
            logger.error(f"Unsplash search failed: {e}")

        return items


class PixabayScraper(BaseScraper):
    def __init__(self, api_key: str = None, **kwargs):
        super().__init__(name="Pixabay", **kwargs)
        self.api_key = api_key
        self.base_url = "https://pixabay.com/api"

    async def search(self, query: str, limit: int = 20) -> List[MediaItem]:
        if not self.session:
            raise RuntimeError("Scraper not initialized. Use 'async with' context manager.")

        if not self.api_key:
            logger.warning("Pixabay API key not provided")
            return []

        items = []
        try:
            response = await self.session.get(
                self.base_url,
                params={
                    "key": self.api_key,
                    "q": query,
                    "per_page": min(limit, 100),
                    "image_type": "photo"
                }
            )
            response.raise_for_status()
            data = response.json()

            for hit in data.get("hits", []):
                item = MediaItem(
                    id=str(hit.get("id", "")),
                    url=hit.get("largeImageURL", ""),
                    thumbnail_url=hit.get("previewURL", ""),
                    title=hit.get("tags", query),
                    source="pixabay",
                    format="jpg",
                    width=hit.get("imageWidth"),
                    height=hit.get("imageHeight"),
                    tags=hit.get("tags", "").split(", ")
                )
                items.append(item)

        except Exception as e:
            logger.error(f"Pixabay search failed: {e}")

        return items


class PexelsScraper(BaseScraper):
    def __init__(self, api_key: str = None, **kwargs):
        super().__init__(name="Pexels", **kwargs)
        self.api_key = api_key
        self.base_url = "https://api.pexels.com/v1"

    async def search(self, query: str, limit: int = 20) -> List[MediaItem]:
        if not self.session:
            raise RuntimeError("Scraper not initialized. Use 'async with' context manager.")

        if not self.api_key:
            logger.warning("Pexels API key not provided")
            return []

        items = []
        try:
            response = await self.session.get(
                f"{self.base_url}/search",
                headers={"Authorization": self.api_key},
                params={"query": query, "per_page": min(limit, 80)}
            )
            response.raise_for_status()
            data = response.json()

            for photo in data.get("photos", []):
                item = MediaItem(
                    id=str(photo.get("id", "")),
                    url=photo.get("src", {}).get("original", ""),
                    thumbnail_url=photo.get("src", {}).get("medium", ""),
                    title=photo.get("alt", query),
                    source="pexels",
                    format="jpg",
                    width=photo.get("width"),
                    height=photo.get("height"),
                    tags=[tag.get("title", "") for tag in photo.get("tags", [])]
                )
                items.append(item)

        except Exception as e:
            logger.error(f"Pexels search failed: {e}")

        return items
