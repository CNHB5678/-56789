import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Mic, FileAudio, Loader, Play, Pause, Trash2 } from 'lucide-react';
import { audioService } from '@/services';
import { useAudioStore } from '@/stores';
import toast from 'react-hot-toast';

export default function AudioPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { transcription, setTranscription, currentAudio, setCurrentAudio, reset } = useAudioStore();

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsProcessing(true);

    try {
      toast.loading('正在转录音频...', { id: 'transcribe' });
      const result = await audioService.transcribe(file);

      setCurrentAudio({
        id: result.id,
        fileName: result.fileName,
        filePath: '',
        duration: result.duration
      });
      setTranscription(result.transcription);

      toast.success('转录完成！', { id: 'transcribe' });
    } catch (error) {
      toast.error('转录失败', { id: 'transcribe' });
      console.error('Transcription failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.flac', '.ogg'],
    },
    multiple: false,
    disabled: isProcessing,
  });

  const handleExtractKeywords = async () => {
    if (!transcription?.fullText) return;

    try {
      toast.loading('正在提取关键词...', { id: 'keywords' });
      const result = await audioService.extractKeywords(transcription.fullText);
      toast.success(`提取到 ${result.keywords.length} 个关键词`, { id: 'keywords' });
    } catch (error) {
      toast.error('关键词提取失败', { id: 'keywords' });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">音频处理</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExtractKeywords}
            disabled={!transcription}
            className="btn btn-secondary"
          >
            提取关键词
          </button>
          {currentAudio && (
            <button onClick={reset} className="btn btn-ghost text-red-500">
              <Trash2 className="w-5 h-5" />
              清除
            </button>
          )}
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`flex-1 border-2 border-dashed rounded-2xl p-8 transition-all duration-200 cursor-pointer
          ${isDragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'}
          ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
      >
        <input {...getInputProps()} />

        <div className="h-full flex flex-col items-center justify-center">
          {isProcessing ? (
            <>
              <Loader className="w-16 h-16 text-primary-500 animate-spin mb-4" />
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400">正在转录音频...</p>
              <p className="text-sm text-gray-500 mt-2">请稍候，这可能需要几分钟</p>
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
              <p className="text-gray-500 mb-4">支持 MP3, WAV, M4A, FLAC, OGG 格式</p>
              <button className="btn btn-primary">
                <FileAudio className="w-5 h-5" />
                选择音频文件
              </button>
            </>
          )}
        </div>
      </div>

      {transcription && (
        <div className="mt-6 card max-h-[500px] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">转录结果</h2>
            <div className="flex gap-2">
              <span className="text-sm text-gray-500">
                {transcription.segments.length} 句
              </span>
              <span className="text-sm text-gray-500">
                {transcription.keywords.length} 个关键词
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {transcription.segments.map((segment, index) => (
              <div
                key={segment.id}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    {segment.startTime.toFixed(1)}s - {segment.endTime.toFixed(1)}s
                  </span>
                  <div className="flex-1" />
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Play className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{segment.text}</p>
                {segment.keywords && segment.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {segment.keywords.map((kw) => (
                      <span
                        key={kw.id}
                        className="px-2 py-0.5 text-xs rounded-full font-medium"
                        style={{ backgroundColor: kw.color + '30', color: kw.color }}
                      >
                        {kw.word}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {transcription.keywords && transcription.keywords.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="font-medium mb-3">关键词标签</h3>
              <div className="flex flex-wrap gap-2">
                {transcription.keywords.map((kw) => (
                  <span
                    key={kw.id}
                    className="px-3 py-1.5 text-sm rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: kw.color + '20', color: kw.color }}
                  >
                    {kw.word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
