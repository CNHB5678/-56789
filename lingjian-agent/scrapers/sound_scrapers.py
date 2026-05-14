import logging
import os
import httpx
from typing import List, Dict, Optional
from .base import BaseScraper, MediaItem
import uuid

logger = logging.getLogger(__name__)


class FreeSoundScraper(BaseScraper):
    def __init__(self, api_key: str = None, **kwargs):
        super().__init__(name="FreeSound", **kwargs)
        self.api_key = api_key
        self.base_url = "https://freesound.org/apiv2"

    async def search(self, query: str, limit: int = 20) -> List[MediaItem]:
        if not self.session:
            raise RuntimeError("Scraper not initialized. Use 'async with' context manager.")

        if not self.api_key:
            logger.warning("FreeSound API key not provided")
            return []

        items = []
        try:
            response = await self.session.get(
                f"{self.base_url}/search/text/",
                params={
                    "token": self.api_key,
                    "query": query,
                    "page_size": min(limit, 50),
                    "fields": "id,name,previews,images,tags"
                }
            )
            response.raise_for_status()
            data = response.json()

            for sound in data.get("results", []):
                preview_url = sound.get("previews", {}).get("preview-hq-mp3", "")
                if preview_url:
                    item = MediaItem(
                        id=f"freesound_{sound.get('id', '')}",
                        url=preview_url,
                        thumbnail_url=sound.get("images", {}).get("waveform_m", ""),
                        title=sound.get("name", query),
                        source="freesound",
                        format="mp3",
                        tags=sound.get("tags", [])
                    )
                    items.append(item)

        except Exception as e:
            logger.error(f"FreeSound search failed: {e}")

        return items


class SoundBibleScraper(BaseScraper):
    def __init__(self, **kwargs):
        super().__init__(name="SoundBible", request_delay=1.0, **kwargs)
        self.base_url = "https://soundbible.com"

    async def search(self, query: str, limit: int = 20) -> List[MediaItem]:
        if not self.session:
            raise RuntimeError("Scraper not initialized. Use 'async with' context manager.")

        items = []
        try:
            search_url = f"{self.base_url}/search.php"
            response = await self._request_with_retry(
                search_url,
                params={"search": query}
            )

            if not response:
                return items

            from bs4 import BeautifulSoup
            soup = BeautifulSoup(response.text, 'html.parser')

            for result in soup.select('.mp3")[:limit]:
                title_elem = result.select_one('.name')
                if title_elem:
                    item = MediaItem(
                        id=f"soundbible_{uuid.uuid4().hex[:8]}",
                        url=result.get('href', ''),
                        thumbnail_url='',
                        title=title_elem.text.strip(),
                        source="soundbible",
                        format="mp3",
                        tags=[query]
                    )
                    items.append(item)

        except Exception as e:
            logger.error(f"SoundBible search failed: {e}")

        return items


class MixkitScraper(BaseScraper):
    def __init__(self, **kwargs):
        super().__init__(name="Mixkit", request_delay=1.0, **kwargs)
        self.base_url = "https://mixkit.co/free-sound-effects"

    async def search(self, query: str, limit: int = 20) -> List[MediaItem]:
        if not self.session:
            raise RuntimeError("Scraper not initialized. Use 'async with' context manager.")

        items = []
        try:
            search_url = f"{self.base_url}/{query.replace(' ', '-')}"
            response = await self._request_with_retry(search_url)

            if not response:
                return items

            from bs4 import BeautifulSoup
            soup = BeautifulSoup(response.text, 'html.parser')

            for result in soup.select('.sound-item')[:limit]:
                link = result.select_one('a')
                download_btn = result.select_one('.download-btn')
                if link and download_btn:
                    item = MediaItem(
                        id=f"mixkit_{uuid.uuid4().hex[:8]}",
                        url=download_btn.get('href', ''),
                        thumbnail_url='',
                        title=link.get('title', query),
                        source="mixkit",
                        format="mp3",
                        tags=[query]
                    )
                    items.append(item)

        except Exception as e:
            logger.error(f"Mixkit search failed: {e}")

        return items
