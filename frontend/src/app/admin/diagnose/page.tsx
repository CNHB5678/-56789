'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { get, post } from '@/lib/api';
import { connectWebSocket } from '@/lib/ws';
import { useAuthStore } from '@/lib/auth-store';
import {
  Activity,
  Play,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader2,
  Clock,
  Wrench,
  RefreshCw,
  Lock,
  Calendar,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

type CheckStatus = 'pending' | 'running' | 'pass' | 'warning' | 'fail';

interface DiagnosticCheck {
  id: string;
  module: string;
  name: string;
  status: CheckStatus;
  message: string;
  fixable: boolean;
  fixing?: boolean;
  duration?: number;
}

interface DiagnosticResult {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  checks: DiagnosticCheck[];
  total_checks: number;
  passed: number;
  warnings: number;
  failed: number;
  started_at?: string;
  completed_at?: string;
}

interface HistoryRecord {
  id: string;
  started_at: string;
  completed_at?: string;
  total_checks: number;
  passed: number;
  warnings: number;
  failed: number;
  status: string;
}

const MODULE_LABELS: Record<string, string> = {
  system: '系统',
  database: '数据库',
  redis: 'Redis',
  ai_asr: 'AI语音识别',
  ai_tts: 'AI语音合成',
  ai_nlp: 'AI自然语言',
  ai_image: 'AI图像生成',
  ai_matting: 'AI抠图',
  sms: '短信服务',
  oss: '对象存储',
  wechat: '微信配置',
};

export default function DiagnosePage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [fixingAll, setFixingAll] = useState(false);
  const [currentDiagnose, setCurrentDiagnose] = useState<DiagnosticResult | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);
  const wsRef = useRef<ReturnType<typeof connectWebSocket> | null>(null);

  const isAdmin = user?.is_admin === true;

  useEffect(() => {
    if (isAdmin) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await get<HistoryRecord[]>('/v1/admin/diagnose/history');
      setHistory(data || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiagnoseStatus = async (diagnoseId: string) => {
    try {
      const data = await get<DiagnosticResult>(`/v1/admin/diagnose/${diagnoseId}/status`);
      setCurrentDiagnose(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch diagnose status:', error);
    }
  };

  const connectDiagnoseWS = useCallback((diagnoseId: string) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';
    const url = `${wsUrl}/admin/diagnose/${diagnoseId}`;

    wsRef.current = connectWebSocket(
      url,
      (data: any) => {
        if (!data || !data.type) return;

        switch (data.type) {
          case 'check_start':
            setCurrentDiagnose((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                checks: prev.checks.map((check) =>
                  check.id === data.check_id ? { ...check, status: 'running' as CheckStatus } : check
                ),
              };
            });
            break;

          case 'check_result':
            setCurrentDiagnose((prev) => {
              if (!prev) return prev;
              const newChecks = prev.checks.map((check) =>
                check.id === data.check_id
                  ? {
                      ...check,
                      status: (data.status || 'fail') as CheckStatus,
                      message: data.message || check.message,
                      duration: data.duration,
                    }
                  : check
              );
              const passed = newChecks.filter((c) => c.status === 'pass').length;
              const warnings = newChecks.filter((c) => c.status === 'warning').length;
              const failed = newChecks.filter((c) => c.status === 'fail').length;
              return {
                ...prev,
                checks: newChecks,
                passed,
                warnings,
                failed,
              };
            });
            break;

          case 'diagnose_complete':
            setCurrentDiagnose((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                status: 'completed',
                completed_at: new Date().toISOString(),
                total_checks: data.total_checks || prev.total_checks,
                passed: data.passed || prev.passed,
                warnings: data.warnings || prev.warnings,
                failed: data.failed || prev.failed,
              };
            });
            fetchHistory();
            if (wsRef.current) {
              wsRef.current.close();
              wsRef.current = null;
            }
            break;

          case 'fix_progress':
            setCurrentDiagnose((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                checks: prev.checks.map((check) =>
                  check.id === data.check_id ? { ...check, fixing: true, message: data.message || '修复中...' } : check
                ),
              };
            });
            break;

          case 'fix_result':
            setCurrentDiagnose((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                checks: prev.checks.map((check) =>
                  check.id === data.check_id
                    ? {
                        ...check,
                        fixing: false,
                        status: (data.status || 'fail') as CheckStatus,
                        message: data.message || check.message,
                      }
                    : check
                ),
              };
            });
            break;
        }
      },
      () => {
        console.log('Diagnose WS connected');
      },
      () => {
        console.log('Diagnose WS closed');
      }
    );
  }, []);

  const handleStartDiagnose = async () => {
    try {
      setStarting(true);
      const result = await post<{ diagnose_id: string; total_checks: number }>('/v1/admin/diagnose/run');
      
      const initialChecks: DiagnosticCheck[] = Array.from({ length: result.total_checks || 24 }, (_, i) => ({
        id: `check-${i}`,
        module: 'system',
        name: `检查项 ${i + 1}`,
        status: 'pending' as CheckStatus,
        message: '等待检查...',
        fixable: false,
      }));

      setCurrentDiagnose({
        id: result.diagnose_id,
        status: 'running',
        checks: initialChecks,
        total_checks: result.total_checks || 24,
        passed: 0,
        warnings: 0,
        failed: 0,
        started_at: new Date().toISOString(),
      });

      connectDiagnoseWS(result.diagnose_id);
      
      toast({
        title: '诊断已启动',
        description: '正在进行全链路诊断...',
      });
    } catch (error: any) {
      toast({
        title: '启动失败',
        description: error.response?.data?.detail || '启动诊断失败',
        variant: 'destructive',
      });
    } finally {
      setStarting(false);
    }
  };

  const handleFixItem = async (checkId: string) => {
    if (!currentDiagnose) return;

    try {
      setCurrentDiagnose((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          checks: prev.checks.map((c) =>
            c.id === checkId ? { ...c, fixing: true, message: '修复中...' } : c
          ),
        };
      });

      await post(`/v1/admin/diagnose/${currentDiagnose.id}/fix`, {
        check_id: checkId,
      });

      await fetchDiagnoseStatus(currentDiagnose.id);
      
      toast({
        title: '修复完成',
        description: '修复操作已执行',
      });
    } catch (error: any) {
      toast({
        title: '修复失败',
        description: error.response?.data?.detail || '执行修复失败',
        variant: 'destructive',
      });
      setCurrentDiagnose((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          checks: prev.checks.map((c) =>
            c.id === checkId ? { ...c, fixing: false } : c
          ),
        };
      });
    }
  };

  const handleFixAll = async () => {
    if (!currentDiagnose) return;

    const fixableItems = currentDiagnose.checks.filter((c) => c.fixable && c.status === 'fail');
    if (fixableItems.length === 0) {
      toast({
        title: '无可修复项',
        description: '当前没有可以自动修复的问题',
      });
      return;
    }

    try {
      setFixingAll(true);
      for (const item of fixableItems) {
        try {
          await post(`/v1/admin/diagnose/${currentDiagnose.id}/fix`, {
            check_id: item.id,
          });
        } catch (e) {
          console.error(`Failed to fix ${item.id}:`, e);
        }
      }
      await fetchDiagnoseStatus(currentDiagnose.id);
      toast({
        title: '批量修复完成',
        description: '所有可修复项已处理',
      });
    } catch (error) {
      toast({
        title: '修复过程出错',
        description: '部分修复操作可能失败',
        variant: 'destructive',
      });
    } finally {
      setFixingAll(false);
    }
  };

  const getStatusIcon = (status: CheckStatus) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-slate-300" />;
    }
  };

  const getStatusText = (status: CheckStatus) => {
    switch (status) {
      case 'pass':
        return '通过';
      case 'warning':
        return '警告';
      case 'fail':
        return '失败';
      case 'running':
        return '检查中';
      default:
        return '等待中';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isAdmin && !loading) {
    return (
      <WorkspaceLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">无权限访问</h2>
                <p className="text-slate-500">您没有管理员权限，无法访问系统诊断页面。</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </WorkspaceLayout>
    );
  }

  const completedChecks = currentDiagnose
    ? currentDiagnose.checks.filter((c) => c.status !== 'pending' && c.status !== 'running').length
    : 0;
  const progressPercent = currentDiagnose
    ? (completedChecks / currentDiagnose.total_checks) * 100
    : 0;

  return (
    <WorkspaceLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">系统智能诊断</h1>
          </div>
          <div className="flex gap-3">
            {currentDiagnose?.status === 'completed' && currentDiagnose.failed > 0 && (
              <Button
                onClick={handleFixAll}
                disabled={fixingAll}
                variant="destructive"
              >
                {fixingAll ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Wrench className="w-4 h-4 mr-2" />
                )}
                一键修复所有可修复项
              </Button>
            )}
            <Button
              onClick={handleStartDiagnose}
              disabled={starting || currentDiagnose?.status === 'running'}
            >
              {starting || currentDiagnose?.status === 'running' ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {currentDiagnose?.status === 'running' ? '诊断中...' : '开始全链路诊断'}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-slate-500">加载中...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {currentDiagnose ? (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>诊断进度</CardTitle>
                        <span className="text-sm text-slate-500">
                          {completedChecks} / {currentDiagnose.total_checks} 项
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Progress value={progressPercent} className="mb-6" />
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 bg-green-50 rounded-xl">
                          <div className="text-3xl font-bold text-green-600">
                            {currentDiagnose.passed}
                          </div>
                          <div className="text-sm text-green-700 mt-1">通过</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-xl">
                          <div className="text-3xl font-bold text-yellow-600">
                            {currentDiagnose.warnings}
                          </div>
                          <div className="text-sm text-yellow-700 mt-1">警告</div>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-xl">
                          <div className="text-3xl font-bold text-red-600">
                            {currentDiagnose.failed}
                          </div>
                          <div className="text-sm text-red-700 mt-1">失败</div>
                        </div>
                      </div>

                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {currentDiagnose.checks.map((check: DiagnosticCheck) => (
                          <div
                            key={check.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                              check.status === 'running'
                                ? 'bg-blue-50 border-blue-200'
                                : check.status === 'fail'
                                ? 'bg-red-50 border-red-200'
                                : check.status === 'warning'
                                ? 'bg-yellow-50 border-yellow-200'
                                : check.status === 'pass'
                                ? 'bg-green-50 border-green-200'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            {getStatusIcon(check.status)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                                  {MODULE_LABELS[check.module] || check.module}
                                </span>
                                <span className="text-sm font-medium text-slate-900">
                                  {check.name}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 truncate">
                                {check.message}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded ${
                                  check.status === 'pass'
                                    ? 'bg-green-100 text-green-700'
                                    : check.status === 'warning'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : check.status === 'fail'
                                    ? 'bg-red-100 text-red-700'
                                    : check.status === 'running'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {getStatusText(check.status)}
                              </span>
                              {check.fixable && check.status === 'fail' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleFixItem(check.id)}
                                  disabled={check.fixing}
                                  className="h-7 px-2"
                                >
                                  {check.fixing ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Wrench className="w-3 h-3" />
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="py-12">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
                        <Activity className="w-10 h-10 text-slate-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">暂无诊断记录</h3>
                        <p className="text-slate-500 mt-1">
                          点击上方"开始全链路诊断"按钮，对系统进行全面健康检查
                        </p>
                      </div>
                      <Button onClick={handleStartDiagnose} disabled={starting}>
                        {starting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4 mr-2" />
                        )}
                        开始诊断
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      历史诊断记录
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={fetchHistory}
                      className="h-8 w-8 p-0"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {history.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      暂无历史记录
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {history.slice(0, 10).map((record: HistoryRecord) => (
                        <div
                          key={record.id}
                          className="border border-slate-200 rounded-lg overflow-hidden"
                        >
                          <button
                            className="w-full p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                            onClick={() =>
                              setExpandedHistory(
                                expandedHistory === record.id ? null : record.id
                              )
                            }
                          >
                            <div className="text-left">
                              <div className="text-sm font-medium text-slate-900">
                                {formatDate(record.started_at)}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                共{record.total_checks}项检查
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 text-xs">
                                <span className="text-green-600">✓{record.passed}</span>
                                <span className="text-yellow-600">⚠{record.warnings}</span>
                                <span className="text-red-600">✗{record.failed}</span>
                              </div>
                              {expandedHistory === record.id ? (
                                <ChevronUp className="w-4 h-4 text-slate-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </button>
                          {expandedHistory === record.id && (
                            <div className="px-3 pb-3 border-t border-slate-100 pt-3">
                              <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="p-2 bg-green-50 rounded">
                                  <div className="text-lg font-bold text-green-600">
                                    {record.passed}
                                  </div>
                                  <div className="text-xs text-green-700">通过</div>
                                </div>
                                <div className="p-2 bg-yellow-50 rounded">
                                  <div className="text-lg font-bold text-yellow-600">
                                    {record.warnings}
                                  </div>
                                  <div className="text-xs text-yellow-700">警告</div>
                                </div>
                                <div className="p-2 bg-red-50 rounded">
                                  <div className="text-lg font-bold text-red-600">
                                    {record.failed}
                                  </div>
                                  <div className="text-xs text-red-700">失败</div>
                                </div>
                              </div>
                              {record.completed_at && (
                                <div className="mt-2 text-xs text-slate-500 text-center">
                                  完成时间: {formatDate(record.completed_at)}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
}
