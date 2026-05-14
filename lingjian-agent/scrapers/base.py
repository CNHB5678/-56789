import logging
from typing import List, Dict, Optional, Any
from abc import ABC, abstractmethod
import asyncio
import httpx
import os
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class MediaItem:
    id: str
    url: str
    thumbnail_url: str
    title: str
    source: str
    format: str
    width: Optional[int] = None
    height: Optional[int] = None
    tags: List[str] = None

    def __post_init__(self):
        if self.tags is None:
            self.tags = []


class BaseScraper(ABC):
    def __init__(
        self,
        name: str,
        request_delay: float = 2.0,
        max_retries: int = 3
    ):
        self.name = name
        self.request_delay = request_delay
        self.max_retries = max_retries
        self.session: Optional[httpx.AsyncClient] = None

    async def __aenter__(self):
        self.session = httpx.AsyncClient(
            timeout=30.0,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.aclose()

    async def _request_with_retry(self, url: str, **kwargs) -> Optional[httpx.Response]:
        for attempt in range(self.max_retries):
            try:
                if self.request_delay > 0 and attempt > 0:
                    await asyncio.sleep(self.request_delay)

                response = await self.session.get(url, **kwargs)
                response.raise_for_status()
                return response

            except httpx.HTTPStatusError as e:
                logger.warning(f"{self.name} HTTP error {e.response.status_code} for {url}")
                if e.response.status_code in [401, 403, 404]:
                    return None
            except Exception as e:
                logger.warning(f"{self.name} request failed (attempt {attempt + 1}): {e}")

            await asyncio.sleep(self.request_delay * (attempt + 1))

        return None

    async def _download_file(self, url: str, save_path: str) -> bool:
        try:
            response = await self._request_with_retry(url)
            if not response:
                return False

            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            with open(save_path, 'wb') as f:
                f.write(response.content)
            return True

        except Exception as e:
            logger.error(f"{self.name} download failed: {e}")
            return False

    @abstractmethod
    async def search(self, query: str, limit: int = 20) -> List[MediaItem]:
        pass

    async def download(self, item: MediaItem, save_dir: str) -> Optional[str]:
        save_path = os.path.join(save_dir, f"{item.id}_{item.source}.{item.format}")
        if await self._download_file(item.url, save_path):
            return save_path
        return None
