from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache
import os


class Settings(BaseSettings):
    app_name: str = "灵剪Agent"
    app_version: str = "1.0.0"
    debug: bool = True

    database_url: str = "sqlite+aiosqlite:///./data/lingjian.db"
    chroma_db_path: str = "./data/chromadb"

    media_root: str = "./data/media"
    temp_dir: str = "./data/temp"
    projects_dir: str = "./data/projects"

    whisper_model: str = "base"
    sd_api_url: str = "http://localhost:7860"
    comfyui_url: str = "http://localhost:7860"

    scraper_request_delay: float = 2.0
    scraper_max_retries: int = 3
    scraper_max_concurrent: int = 3

    cors_origins: list[str] = ["http://localhost:3000", "http://localhost:1420"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    def setup_directories(self):
        for directory in [self.media_root, self.temp_dir, self.projects_dir, self.chroma_db_path]:
            os.makedirs(directory, exist_ok=True)


@lru_cache()
def get_settings() -> Settings:
    settings = Settings()
    settings.setup_directories()
    return settings
