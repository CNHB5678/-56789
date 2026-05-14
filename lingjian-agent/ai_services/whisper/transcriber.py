import logging
from typing import Optional, List, Dict, Any
from dataclasses import dataclass
import uuid
import os
import aiofiles

logger = logging.getLogger(__name__)


@dataclass
class Segment:
    id: str
    start_time: float
    end_time: float
    text: str


@dataclass
class TranscriptionResult:
    id: str
    file_name: str
    duration: float
    full_text: str
    language: Optional[str]
    segments: List[Segment]


class WhisperTranscriber:
    def __init__(self, model_name: str = "base"):
        self.model_name = model_name
        self.model = None
        self._initialized = False

    async def initialize(self):
        if self._initialized:
            return

        try:
            from faster_whisper import WhisperModel
            logger.info(f"Loading Whisper model: {self.model_name}")

            compute_type = "float16"
            try:
                self.model = WhisperModel(
                    self.model_name,
                    device="cuda",
                    compute_type=compute_type
                )
            except Exception as e:
                logger.warning(f"CUDA not available, using CPU: {e}")
                self.model = WhisperModel(
                    self.model_name,
                    device="cpu",
                    compute_type="int8"
                )

            self._initialized = True
            logger.info("Whisper model loaded successfully")
        except ImportError:
            logger.warning("faster-whisper not installed, using fallback")
            self._initialized = True

    async def transcribe(
        self,
        audio_path: str,
        language: Optional[str] = None,
        task: str = "transcribe"
    ) -> TranscriptionResult:
        await self.initialize()

        audio_id = str(uuid.uuid4())
        logger.info(f"Transcribing audio: {audio_path}")

        if self.model:
            try:
                segments, info = self.model.transcribe(
                    audio_path,
                    language=language,
                    task=task,
                    beam_size=5,
                    vad_filter=True
                )

                segment_list = []
                full_text_parts = []

                for seg in segments:
                    segment = Segment(
                        id=str(uuid.uuid4()),
                        start_time=seg.start,
                        end_time=seg.end,
                        text=seg.text.strip()
                    )
                    segment_list.append(segment)
                    full_text_parts.append(segment.text)

                return TranscriptionResult(
                    id=audio_id,
                    file_name=os.path.basename(audio_path),
                    duration=info.duration if hasattr(info, 'duration') else 0,
                    full_text=" ".join(full_text_parts),
                    language=info.language if hasattr(info, 'language') else language,
                    segments=segment_list
                )

            except Exception as e:
                logger.error(f"Whisper transcription failed: {e}")
                return self._create_empty_result(audio_id, audio_path)

        return self._create_empty_result(audio_id, audio_path)

    def _create_empty_result(self, audio_id: str, audio_path: str) -> TranscriptionResult:
        return TranscriptionResult(
            id=audio_id,
            file_name=os.path.basename(audio_path),
            duration=0,
            full_text="",
            language=None,
            segments=[]
        )

    async def transcribe_upload(self, file_content: bytes, file_name: str) -> TranscriptionResult:
        import tempfile
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file_name)[1]) as tmp:
            tmp.write(file_content)
            tmp_path = tmp.name

        try:
            result = await self.transcribe(tmp_path)
            result.file_name = file_name
            return result
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
