import logging
from typing import List, Dict, Optional, Tuple
import numpy as np
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class MatchResult:
    media_id: str
    similarity: float
    matched_keywords: List[str]


class SemanticMatcher:
    def __init__(self, model_name: str = "paraphrase-multilingual-MiniLM-L12-v2"):
        self.model_name = model_name
        self._model = None
        self._initialized = False
        self._embeddings_cache: Dict[str, np.ndarray] = {}

    async def initialize(self):
        if self._initialized:
            return

        try:
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading semantic model: {self.model_name}")
            self._model = SentenceTransformer(self.model_name)
            self._initialized = True
            logger.info("Semantic model loaded successfully")
        except ImportError as e:
            logger.error(f"Failed to load semantic model: {e}")
            self._initialized = True

    async def encode(self, texts: List[str]) -> np.ndarray:
        await self.initialize()
        if self._model:
            return self._model.encode(texts, convert_to_numpy=True)
        return np.zeros((len(texts), 384))

    async def compute_similarity(
        self,
        query: str,
        candidates: List[str]
    ) -> List[float]:
        await self.initialize()

        if not candidates:
            return []

        query_embedding = await self.encode([query])
        candidate_embeddings = await self.encode(candidates)

        similarities = []
        for i in range(len(candidates)):
            sim = self._cosine_similarity(query_embedding[0], candidate_embeddings[i])
            similarities.append(float(sim))

        return similarities

    def _cosine_similarity(self, a: np.ndarray, b: np.ndarray) -> float:
        dot_product = np.dot(a, b)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot_product / (norm_a * norm_b)

    async def find_matches(
        self,
        query_keywords: List[str],
        candidate_data: List[Dict],
        threshold: float = 0.6,
        top_k: int = 10
    ) -> List[MatchResult]:
        await self.initialize()

        if not candidate_data or not query_keywords:
            return []

        query_text = " ".join(query_keywords)
        results = []

        for candidate in candidate_data:
            candidate_id = candidate.get('id', '')
            tags = candidate.get('tags', [])
            name = candidate.get('name', '')

            if not tags:
                tags = [name] if name else []

            if not tags:
                continue

            candidate_text = " ".join(tags)

            similarities = await self.compute_similarity(query_text, [candidate_text])
            similarity = similarities[0] if similarities else 0.0

            if similarity >= threshold:
                matched_keywords = self._find_matched_keywords(query_keywords, tags)
                results.append(MatchResult(
                    media_id=candidate_id,
                    similarity=similarity,
                    matched_keywords=matched_keywords
                ))

        results.sort(key=lambda x: x.similarity, reverse=True)
        return results[:top_k]

    def _find_matched_keywords(
        self,
        query_keywords: List[str],
        candidate_tags: List[str]
    ) -> List[str]:
        query_set = set(k.lower() for k in query_keywords)
        tag_set = set(t.lower() for t in candidate_tags)
        matched = query_set.intersection(tag_set)
        return list(matched)

    async def add_to_cache(self, media_id: str, tags: List[str]):
        if self._model and tags:
            embedding = await self.encode([" ".join(tags)])
            self._embeddings_cache[media_id] = embedding[0]

    def clear_cache(self):
        self._embeddings_cache.clear()
