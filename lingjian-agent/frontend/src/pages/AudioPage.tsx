import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Mic, FileAudio, Loader } from 'lucide-react';
import { audioService } from '@/services';
import { useAudioStore } from '@/stores';

export default function AudioPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { transcription, setTranscription } = useAudioStore();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setIsProcessing(true);

      try {
        const result = await audioService.transcribe(file);
        setTranscription(result.transcription);
      } catch (error) {
        console.error('Transcription failed:', error);
      } finally {
        setIsProcessing(false);
      }
    },
    [setTranscription]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.flac', '.ogg'],
    },
    multiple: false,
    disabled: isProcessing,
  });

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        音频处理
      </h1>

      <div
        {...getRootProps()}
        className={`flex-1 border-2 border-dashed rounded-2xl p-8 transition-all duration-200 cursor-pointer
          ${
            isDragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
          }
          ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input {...getInputProps()} />

        <div className="h-full flex flex-col items-center justify-center">
          {isProcessing ? (
            <>
              <Loader className="w-16 h-16 text-primary-500 animate-spin mb-4" />
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                正在转录音频...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                请稍候，这可能需要几分钟
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center mb-4">
                {isDragActive ? (
                  <Upload className="w-10 h-10 text-primary-500" />
                ) : (
                  <Mic className="w-10 h-10 text-primary-500" />
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {isDragActive ? '释放以上传音频' : '拖拽音频文件或点击上传'}
              </h2>
              <p className="text-gray-500 mb-4">
                支持 MP3, WAV, M4A, FLAC, OGG 格式
              </p>
              <button className="btn btn-primary">
                <FileAudio className="w-5 h-5" />
                选择音频文件
              </button>
            </>
          )}
        </div>
      </div>

      {transcription && (
        <div className="mt-6 card">
          <h2 className="font-semibold text-lg mb-4">转录结果</h2>
          <div className="space-y-4">
            {transcription.segments.map((segment) => (
              <div
                key={segment.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500">
                    {segment.startTime.toFixed(1)}s - {segment.endTime.toFixed(1)}s
                  </span>
                  <div className="flex gap-1">
                    {segment.keywords.map((kw) => (
                      <span
                        key={kw.id}
                        className="px-2 py-0.5 text-xs rounded-full"
                        style={{ backgroundColor: kw.color + '30', color: kw.color }}
                      >
                        {kw.word}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{segment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
