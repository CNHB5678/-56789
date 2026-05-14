import logging
from typing import List, Dict, Optional
from dataclasses import dataclass
import uuid
import re

logger = logging.getLogger(__name__)


@dataclass
class Keyword:
    id: str
    word: str
    category: str
    color: str
    position: Dict[str, int]


KEYWORD_COLORS = {
    'person': '#FF6B6B',
    'location': '#4ECDC4',
    'object': '#45B7D1',
    'action': '#96CEB4',
    'emotion': '#FFEAA7',
    'organization': '#DDA0DD',
    'time': '#F7DC6F',
    'other': '#DFE6E9'
}


class KeywordExtractor:
    def __init__(self):
        self._model = None
        self._initialized = False

    async def initialize(self):
        if self._initialized:
            return

        try:
            import spacy
            try:
                self._nlp = spacy.load("zh_core_web_sm")
            except OSError:
                logger.info("Downloading spaCy Chinese model...")
                import subprocess
                subprocess.run(["python", "-m", "spacy", "download", "zh_core_web_sm"], check=True)
                self._nlp = spacy.load("zh_core_web_sm")
            self._initialized = True
            logger.info("Keyword extractor initialized with spaCy")
        except ImportError:
            logger.warning("spaCy not installed, using simple extraction")
            self._nlp = None
            self._initialized = True

    async def extract_keywords(
        self,
        text: str,
        top_k: int = 20,
        min_length: int = 2
    ) -> List[Keyword]:
        await self.initialize()

        if not text or len(text.strip()) == 0:
            return []

        keywords = []

        if self._nlp:
            keywords = await self._extract_with_spacy(text, top_k, min_length)
        else:
            keywords = self._extract_simple(text, top_k, min_length)

        return keywords

    async def _extract_with_spacy(
        self,
        text: str,
        top_k: int,
        min_length: int
    ) -> List[Keyword]:
        doc = self._nlp(text)
        seen = set()
        keywords = []

        for ent in doc.ents:
            if len(ent.text) >= min_length and ent.text not in seen:
                seen.add(ent.text)
                category = self._map_ent_type(ent.label_)
                keywords.append(Keyword(
                    id=str(uuid.uuid4()),
                    word=ent.text,
                    category=category,
                    color=KEYWORD_COLORS.get(category, KEYWORD_COLORS['other']),
                    position={'start': ent.start_char, 'end': ent.end_char}
                ))

        for token in doc:
            if (
                token.pos_ in ['NOUN', 'VERB', 'ADJ'] and
                len(token.text) >= min_length and
                not token.is_stop and
                token.text not in seen
            ):
                seen.add(token.text)
                keywords.append(Keyword(
                    id=str(uuid.uuid4()),
                    word=token.text,
                    category='other',
                    color=KEYWORD_COLORS['other'],
                    position={'start': token.idx, 'end': token.idx + len(token.text)}
                ))

        return keywords[:top_k]

    def _extract_simple(self, text: str, top_k: int, min_length: int) -> List[Keyword]:
        words = re.findall(r'[\w\u4e00-\u9fff]+', text)
        word_freq = {}
        for word in words:
            if len(word) >= min_length:
                word_freq[word] = word_freq.get(word, 0) + 1

        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        keywords = []

        stop_words = {'的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这'}
        for word, freq in sorted_words:
            if word not in stop_words:
                keywords.append(Keyword(
                    id=str(uuid.uuid4()),
                    word=word,
                    category='other',
                    color=KEYWORD_COLORS['other'],
                    position={'start': 0, 'end': 0}
                ))
            if len(keywords) >= top_k:
                break

        return keywords

    def _map_ent_type(self, ent_type: str) -> str:
        mapping = {
            'PERSON': 'person',
            'GPE': 'location',
            'LOC': 'location',
            'ORG': 'organization',
            'DATE': 'time',
            'TIME': 'time',
            'EVENT': 'action',
            'PRODUCT': 'object',
            'WORK_OF_ART': 'object',
            'NORP': 'organization'
        }
        return mapping.get(ent_type, 'other')

    async def extract_keywords_for_segments(
        self,
        segments: List[Dict]
    ) -> List[Dict]:
        for segment in segments:
            text = segment.get('text', '')
            keywords = await self.extract_keywords(text, top_k=5)
            segment['keywords'] = [
                {
                    'id': kw.id,
                    'word': kw.word,
                    'category': kw.category,
                    'color': kw.color
                }
                for kw in keywords
            ]
        return segments
