import asyncio
import json
import logging
import time
from typing import Optional, Any, Dict, Set
from .config import settings

logger = logging.getLogger(__name__)


class InMemoryCache:
    def __init__(self):
        self._data: Dict[str, tuple] = {}
        self._sets: Dict[str, Set[str]] = {}
        self._lock = asyncio.Lock()

    async def set(self, key: str, value: Any, expire: Optional[int] = None):
        async with self._lock:
            expiry = time.time() + expire if expire else None
            self._data[key] = (value, expiry)

    async def get(self, key: str) -> Optional[str]:
        async with self._lock:
            item = self._data.get(key)
            if not item:
                return None
            value, expiry = item
            if expiry and time.time() > expiry:
                del self._data[key]
                return None
            return value if isinstance(value, str) else str(value)

    async def get_json(self, key: str) -> Optional[Any]:
        value = await self.get(key)
        if value is not None:
            try:
                return json.loads(value)
            except (json.JSONDecodeError, TypeError):
                return value
        return None

    async def delete(self, *keys: str):
        async with self._lock:
            for k in keys:
                self._data.pop(k, None)
                self._sets.pop(k, None)

    async def sadd(self, key: str, *values: str):
        async with self._lock:
            if key not in self._sets:
                self._sets[key] = set()
            self._sets[key].update(values)

    async def srem(self, key: str, *values: str):
        async with self._lock:
            if key in self._sets:
                self._sets[key].difference_update(values)

    async def smembers(self, key: str) -> set:
        async with self._lock:
            return self._sets.get(key, set()).copy()

    async def ping(self):
        return True

    async def close(self):
        pass


class RedisClient:
    def __init__(self):
        self._client = None
        self._fallback = InMemoryCache()
        self._use_fallback = False

    async def init(self):
        try:
            import redis.asyncio as aioredis
            self._client = aioredis.from_url(settings.REDIS_URL, decode_responses=True, socket_connect_timeout=2)
            await self._client.ping()
            self._use_fallback = False
            logger.info("Connected to Redis")
        except Exception as e:
            logger.warning(f"Redis not available ({e}), using in-memory cache fallback")
            self._use_fallback = True
            self._client = self._fallback

    async def close(self):
        if self._client and not self._use_fallback:
            await self._client.close()

    async def set(self, key: str, value: Any, expire: Optional[int] = None):
        if isinstance(value, (dict, list)):
            value = json.dumps(value, ensure_ascii=False)
        await self._client.set(key, value, ex=expire)

    async def get(self, key: str) -> Optional[str]:
        return await self._client.get(key)

    async def get_json(self, key: str) -> Optional[Any]:
        value = await self.get(key)
        if value is not None:
            try:
                return json.loads(value)
            except (json.JSONDecodeError, TypeError):
                return value
        return None

    async def delete(self, *keys: str):
        await self._client.delete(*keys)

    async def sadd(self, key: str, *values: str):
        await self._client.sadd(key, *values)

    async def srem(self, key: str, *values: str):
        await self._client.srem(key, *values)

    async def smembers(self, key: str) -> set:
        return await self._client.smembers(key)


redis_client = RedisClient()
