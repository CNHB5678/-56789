import redis.asyncio as redis
from typing import Optional, Any
import json
from .config import settings


class RedisClient:
    def __init__(self):
        self._client: Optional[redis.Redis] = None

    async def init(self):
        self._client = redis.from_url(settings.REDIS_URL, decode_responses=True)
        await self._client.ping()

    async def close(self):
        if self._client:
            await self._client.close()

    @property
    def client(self) -> redis.Redis:
        if not self._client:
            raise RuntimeError("Redis client not initialized")
        return self._client

    async def set(self, key: str, value: Any, expire: Optional[int] = None):
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        await self.client.set(key, value, ex=expire)

    async def get(self, key: str) -> Optional[str]:
        return await self.client.get(key)

    async def get_json(self, key: str) -> Optional[Any]:
        value = await self.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
        return None

    async def delete(self, *keys: str):
        await self.client.delete(*keys)

    async def sadd(self, key: str, *values: str):
        await self.client.sadd(key, *values)

    async def srem(self, key: str, *values: str):
        await self.client.srem(key, *values)

    async def smembers(self, key: str) -> set:
        return await self.client.smembers(key)


redis_client = RedisClient()
