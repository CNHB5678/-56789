import logging
import os
import json
from typing import List, Dict, Optional
from dataclasses import dataclass
from datetime import datetime

logger = logging.getLogger(__name__)


@dataclass
class MissingAsset:
    keyword: str
    media_type: str
    created_at: datetime
    retry_count: int = 0
    status: str = "pending"


class ScraperManager:
    def __init__(
        self,
        media_dir: str = "./data/media",
        missing_tracker_path: str = "./data/missing_assets.json"
    ):
        self.media_dir = media_dir
        self.missing_tracker_path = missing_tracker_path
        self.missing_assets: List[MissingAsset] = []
        self._load_missing_tracker()

    def _load_missing_tracker(self):
        if os.path.exists(self.missing_tracker_path):
            try:
                with open(self.missing_tracker_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.missing_assets = [
                        MissingAsset(
                            keyword=item['keyword'],
                            media_type=item['media_type'],
                            created_at=datetime.fromisoformat(item['created_at']),
                            retry_count=item.get('retry_count', 0),
                            status=item.get('status', 'pending')
                        )
                        for item in data
                    ]
            except Exception as e:
                logger.error(f"Failed to load missing tracker: {e}")

    def _save_missing_tracker(self):
        try:
            with open(self.missing_tracker_path, 'w', encoding='utf-8') as f:
                data = [
                    {
                        'keyword': asset.keyword,
                        'media_type': asset.media_type,
                        'created_at': asset.created_at.isoformat(),
                        'retry_count': asset.retry_count,
                        'status': asset.status
                    }
                    for asset in self.missing_assets
                ]
                json.dump(data, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"Failed to save missing tracker: {e}")

    def add_missing(self, keyword: str, media_type: str):
        existing = [a for a in self.missing_assets if a.keyword == keyword and a.media_type == media_type]
        if not existing:
            self.missing_assets.append(MissingAsset(
                keyword=keyword,
                media_type=media_type,
                created_at=datetime.now()
            ))
            self._save_missing_tracker()

    async def scrape_for_keywords(
        self,
        keywords: List[str],
        media_type: str = "image",
        scrapers: List = None
    ) -> Dict:
        from .image_scrapers import UnsplashScraper, PixabayScraper, PexelsScraper
        from .sound_scrapers import FreeSoundScraper, MixkitScraper

        scraped_items = []
        missing_keywords = []

        if media_type == "image" or media_type == "video":
            available_scrapers = [
                UnsplashScraper(),
                PixabayScraper(),
                PexelsScraper()
            ]
        else:
            available_scrapers = [
                FreeSoundScraper(),
                MixkitScraper()
            ]

        if scrapers:
            available_scrapers.extend(scrapers)

        for keyword in keywords:
            found = False
            for scraper in available_scrapers:
                async with scraper:
                    try:
                        items = await scraper.search(keyword, limit=10)
                        if items:
                            scraped_items.extend(items)
                            found = True
                            logger.info(f"Found {len(items)} items for keyword '{keyword}' from {scraper.name}")
                    except Exception as e:
                        logger.error(f"Scraper {scraper.name} failed for '{keyword}': {e}")

            if not found:
                missing_keywords.append(keyword)
                self.add_missing(keyword, media_type)

        return {
            "scraped": [
                {
                    "id": item.id,
                    "url": item.url,
                    "thumbnail_url": item.thumbnail_url,
                    "title": item.title,
                    "source": item.source,
                    "format": item.format,
                    "tags": item.tags
                }
                for item in scraped_items
            ],
            "missing_keywords": missing_keywords,
            "total_scraped": len(scraped_items),
            "total_missing": len(missing_keywords)
        }

    def get_pending_missing(self, media_type: str = None) -> List[MissingAsset]:
        if media_type:
            return [a for a in self.missing_assets if a.media_type == media_type and a.status == "pending"]
        return [a for a in self.missing_assets if a.status == "pending"]

    def mark_as_generated(self, keyword: str, media_type: str):
        for asset in self.missing_assets:
            if asset.keyword == keyword and asset.media_type == media_type:
                asset.status = "generated"
        self._save_missing_tracker()
