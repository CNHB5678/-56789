'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Mic,
  FileText,
  ChevronLeft,
  ChevronRight,
  Check,
  Music2,
  Type,
  Subtitles,
  CheckCircle2,
} from 'lucide-react';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { post } from '@/lib/api';

type CreateMode = 'audio' | 'text';
type SubtitleStyle = 'default' | 'classic' | 'modern' | 'minimal';

const steps = [
  { id: 1, label: '选择模式' },
  { id: 2, label: '输入内容' },
  { id: 3, label: '配置选项' },
  { id: 4, label: '确认创建' },
];

const subtitleStyles: { value: SubtitleStyle; label: string; desc: string }[] = [
  { value: 'default', label: '默认样式', desc: '白色字体，黑色描边' },
  { value: 'classic', label: '经典字幕', desc: '黄色字体，黑色阴影' },
  { value: 'modern', label: '现代风格', desc: '白色字体，半透明背景' },
  { value: 'minimal', label: '极简风格', desc: '白色细字体，无描边' },
];

export default function CreatePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [mode, setMode] = useState<CreateMode | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [subtitleEnabled, setSubtitleEnabled] = useState(true);
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyle>('default');
  const [bgmFile, setBgmFile] = useState<File | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isBgmDragging, setIsBgmDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgmInputRef = useRef<HTMLInputElement>(null);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return mode !== null;
      case 2:
        if (mode === 'audio') return audioFile !== null;
        return textContent.trim().length > 0;
      case 3:
        return true;
      case 4:
        return projectTitle.trim().length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAudioDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('audio/')) {
      setAudioFile(files[0]);
      if (!projectTitle) {
        setProjectTitle(files[0].name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAudioFile(files[0]);
      if (!projectTitle) {
        setProjectTitle(files[0].name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleBgmDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsBgmDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('audio/')) {
      setBgmFile(files[0]);
    }
  };

  const handleBgmSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setBgmFile(files[0]);
    }
  };

  const handleCreate = async () => {
    if (!canProceed()) return;
    setIsCreating(true);

    try {
      const formData = new FormData();
      formData.append('title', projectTitle);
      formData.append('mode', mode!);
      formData.append('subtitle_enabled', String(subtitleEnabled));
      formData.append('subtitle_style', subtitleStyle);

      if (mode === 'audio' && audioFile) {
        formData.append('audio', audioFile);
      } else if (mode === 'text') {
        formData.append('text_content', textContent);
      }

      if (bgmFile) {
        formData.append('bgm', bgmFile);
      }

      await post('/v1/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setCreateSuccess(true);
      setTimeout(() => {
        router.push('/workspace');
      }, 2000);
    } catch (error) {
      alert('创建失败，请重试');
      setIsCreating(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (createSuccess) {
    return (
      <WorkspaceLayout>
        <div className="max-w-lg mx-auto py-20 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">创建成功！</h2>
          <p className="text-slate-500 mb-6">项目正在处理中，即将跳转到项目列表...</p>
          <p className="text-sm text-slate-400">处理完成后可以进行文案校对</p>
        </div>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                      currentStep > step.id
                        ? 'bg-green-600 text-white'
                        : currentStep === step.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium hidden sm:block',
                      currentStep >= step.id ? 'text-slate-900' : 'text-slate-400'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 bg-slate-200">
                    <div
                      className={cn(
                        'h-full transition-all',
                        currentStep > step.id ? 'bg-green-600' : 'bg-slate-200'
                      )}
                      style={{ width: currentStep > step.id ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && '选择创建模式'}
              {currentStep === 2 && (mode === 'audio' ? '上传音频' : '输入文案')}
              {currentStep === 3 && '配置选项'}
              {currentStep === 4 && '确认创建'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && '选择您要使用的内容输入方式'}
              {currentStep === 2 && mode === 'audio' && '上传音频文件用于生成视频字幕'}
              {currentStep === 2 && mode === 'text' && '输入文案内容，AI将为您生成视频'}
              {currentStep === 3 && '设置字幕样式和背景音乐'}
              {currentStep === 4 && '确认项目信息后创建'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setMode('audio')}
                  className={cn(
                    'p-6 border-2 rounded-xl text-left transition-all hover:border-blue-300',
                    mode === 'audio'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 bg-white'
                  )}
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                      mode === 'audio' ? 'bg-blue-600' : 'bg-slate-100'
                    )}
                  >
                    <Mic
                      className={cn(
                        'w-6 h-6',
                        mode === 'audio' ? 'text-white' : 'text-slate-600'
                      )}
                    />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-1">音频上传</h3>
                  <p className="text-sm text-slate-500">
                    上传音频文件，AI自动识别语音并生成字幕
                  </p>
                </button>

                <button
                  onClick={() => setMode('text')}
                  className={cn(
                    'p-6 border-2 rounded-xl text-left transition-all hover:border-blue-300',
                    mode === 'text'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 bg-white'
                  )}
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                      mode === 'text' ? 'bg-blue-600' : 'bg-slate-100'
                    )}
                  >
                    <FileText
                      className={cn(
                        'w-6 h-6',
                        mode === 'text' ? 'text-white' : 'text-slate-600'
                      )}
                    />
                  </div>
                  <h3 className="font-semibold text-lg text-slate-900 mb-1">文案输入</h3>
                  <p className="text-sm text-slate-500">
                    直接输入文案内容，AI将为您生成配音和视频
                  </p>
                </button>
              </div>
            )}

            {currentStep === 2 && mode === 'audio' && (
              <div className="space-y-4">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleAudioDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors',
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-300 hover:border-blue-400'
                  )}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleAudioSelect}
                    className="hidden"
                  />
                  {audioFile ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Mic className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="font-medium text-slate-900">{audioFile.name}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {formatFileSize(audioFile.size)}
                      </p>
                      <p className="text-sm text-blue-600 mt-2">点击重新选择</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="font-medium text-slate-900 mb-1">
                        拖拽音频文件到此处或点击上传
                      </p>
                      <p className="text-sm text-slate-500">
                        支持 MP3、WAV、M4A 等音频格式
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}

            {currentStep === 2 && mode === 'text' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text-content">文案内容</Label>
                  <textarea
                    id="text-content"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    rows={10}
                    placeholder="请输入您的文案内容，AI将根据文案生成配音和视频..."
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  />
                  <p className="text-xs text-slate-400 text-right">
                    {textContent.length} 字
                  </p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Subtitles className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">字幕开关</p>
                      <p className="text-sm text-slate-500">是否在视频中显示字幕</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSubtitleEnabled(!subtitleEnabled)}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors relative',
                      subtitleEnabled ? 'bg-blue-600' : 'bg-slate-300'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform shadow',
                        subtitleEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      )}
                    />
                  </button>
                </div>

                {subtitleEnabled && (
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Type className="w-4 h-4" />
                      字幕样式
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {subtitleStyles.map((style) => (
                        <button
                          key={style.value}
                          onClick={() => setSubtitleStyle(style.value)}
                          className={cn(
                            'p-4 border rounded-lg text-left transition-all',
                            subtitleStyle === style.value
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-slate-200 hover:border-slate-300'
                          )}
                        >
                          <p className="font-medium text-slate-900">{style.label}</p>
                          <p className="text-sm text-slate-500 mt-1">{style.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Music2 className="w-4 h-4" />
                    背景音乐（可选）
                  </Label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsBgmDragging(true);
                    }}
                    onDragLeave={() => setIsBgmDragging(false)}
                    onDrop={handleBgmDrop}
                    onClick={() => bgmInputRef.current?.click()}
                    className={cn(
                      'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                      isBgmDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-300 hover:border-blue-400'
                    )}
                  >
                    <input
                      ref={bgmInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleBgmSelect}
                      className="hidden"
                    />
                    {bgmFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <Music2 className="w-6 h-6 text-green-600" />
                        <div className="text-left">
                          <p className="font-medium text-slate-900">{bgmFile.name}</p>
                          <p className="text-sm text-slate-500">
                            {formatFileSize(bgmFile.size)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setBgmFile(null);
                          }}
                          className="ml-2 text-red-500 hover:text-red-600 text-sm"
                        >
                          移除
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600">
                          点击或拖拽上传背景音乐
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          支持 MP3、WAV 格式（可选）
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="project-title">项目名称</Label>
                  <Input
                    id="project-title"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="请输入项目名称"
                  />
                </div>

                <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-medium text-slate-900">项目信息摘要</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">创建模式</span>
                      <span className="text-slate-900">
                        {mode === 'audio' ? '音频上传' : '文案输入'}
                      </span>
                    </div>
                    {mode === 'audio' && audioFile && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">音频文件</span>
                        <span className="text-slate-900">{audioFile.name}</span>
                      </div>
                    )}
                    {mode === 'text' && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">文案字数</span>
                        <span className="text-slate-900">{textContent.length} 字</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">字幕</span>
                      <span className="text-slate-900">
                        {subtitleEnabled ? '开启' : '关闭'}
                      </span>
                    </div>
                    {subtitleEnabled && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">字幕样式</span>
                        <span className="text-slate-900">
                          {subtitleStyles.find((s) => s.value === subtitleStyle)?.label}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500">背景音乐</span>
                      <span className="text-slate-900">
                        {bgmFile ? bgmFile.name : '无'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            上一步
          </Button>

          {currentStep < 4 ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              下一步
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={!canProceed() || isCreating}
            >
              {isCreating ? (
                <>创建中...</>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  创建项目
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  );
}
