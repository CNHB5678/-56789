'use client';

import { useState, useEffect } from 'react';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { get, post, put } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { Settings, Eye, EyeOff, Save, RefreshCw, Play, Loader2, Lock } from 'lucide-react';

interface ConfigItem {
  key: string;
  label: string;
  value: string;
  type: 'text' | 'password' | 'number' | 'switch';
  description: string;
  is_secret: boolean;
  enabled: boolean;
}

interface ConfigCategory {
  category: string;
  label: string;
  items: ConfigItem[];
}

const CATEGORIES: { key: string; label: string; icon: string }[] = [
  { key: 'ai_asr', label: 'AI语音识别', icon: '🎤' },
  { key: 'ai_tts', label: 'AI语音合成', icon: '🔊' },
  { key: 'ai_nlp', label: 'AI自然语言', icon: '💬' },
  { key: 'ai_image', label: 'AI图像生成', icon: '🖼️' },
  { key: 'ai_matting', label: 'AI抠图', icon: '✂️' },
  { key: 'sms', label: '短信服务', icon: '📱' },
  { key: 'oss', label: '对象存储', icon: '☁️' },
  { key: 'wechat', label: '微信配置', icon: '💚' },
  { key: 'system', label: '系统设置', icon: '⚙️' },
];

export default function ConfigPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('ai_asr');
  const [configs, setConfigs] = useState<Record<string, ConfigItem[]>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const isAdmin = user?.is_admin === true;

  useEffect(() => {
    if (isAdmin) {
      fetchConfigs();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const data = await get<ConfigCategory[]>('/v1/admin/config');
      const configMap: Record<string, ConfigItem[]> = {};
      if (Array.isArray(data)) {
        data.forEach((cat) => {
          configMap[cat.category] = cat.items || [];
        });
      }
      CATEGORIES.forEach((cat) => {
        if (!configMap[cat.key]) {
          configMap[cat.key] = [];
        }
      });
      setConfigs(configMap);
    } catch (error) {
      toast({
        title: '加载失败',
        description: '获取系统配置失败',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInitConfig = async () => {
    try {
      setInitializing(true);
      await post('/v1/admin/config/init');
      toast({
        title: '初始化成功',
        description: '默认配置已初始化',
      });
      await fetchConfigs();
    } catch (error) {
      toast({
        title: '初始化失败',
        description: '初始化默认配置失败',
        variant: 'destructive',
      });
    } finally {
      setInitializing(false);
    }
  };

  const handleValueChange = (category: string, key: string, field: 'value' | 'enabled', value: string | boolean) => {
    setConfigs((prev) => ({
      ...prev,
      [category]: prev[category].map((item) =>
        item.key === key ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSaveItem = async (category: string, key: string) => {
    const item = configs[category]?.find((i) => i.key === key);
    if (!item) return;

    try {
      setSaving(true);
      await put(`/v1/admin/config/${category}/${key}`, {
        value: item.value,
        enabled: item.enabled,
      });
      toast({
        title: '保存成功',
        description: `${item.label} 配置已保存`,
      });
    } catch (error) {
      toast({
        title: '保存失败',
        description: `保存 ${item.label} 配置失败`,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const categoryItems = configs[activeCategory] || [];
      await put(`/v1/admin/config/${activeCategory}`, {
        items: categoryItems.map((item) => ({
          key: item.key,
          value: item.value,
          enabled: item.enabled,
        })),
      });
      toast({
        title: '保存成功',
        description: '所有配置已保存',
      });
    } catch (error) {
      toast({
        title: '保存失败',
        description: '批量保存配置失败',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async (category: string, key: string) => {
    const item = configs[category]?.find((i) => i.key === key);
    if (!item) return;

    try {
      setTestingKey(key);
      const result = await post<{ success: boolean; message: string }>(
        `/v1/admin/config/${category}/${key}/test`
      );
      toast({
        title: result.success ? '测试成功' : '测试失败',
        description: result.message || (result.success ? '连接正常' : '连接失败'),
        variant: result.success ? 'default' : 'destructive',
      });
    } catch (error: any) {
      toast({
        title: '测试失败',
        description: error.response?.data?.detail || '测试连接失败',
        variant: 'destructive',
      });
    } finally {
      setTestingKey(null);
    }
  };

  const toggleSecretVisibility = (key: string) => {
    setShowSecrets((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const maskValue = (value: string): string => {
    if (!value || value.length <= 4) return '••••';
    return value.slice(0, 2) + '••••••' + value.slice(-2);
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
                <p className="text-slate-500">您没有管理员权限，无法访问系统配置页面。</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </WorkspaceLayout>
    );
  }

  const currentCategoryItems = configs[activeCategory] || [];
  const currentCategoryInfo = CATEGORIES.find((c) => c.key === activeCategory);

  return (
    <WorkspaceLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">系统配置</h1>
          </div>
          <Button onClick={handleInitConfig} disabled={initializing} variant="outline">
            {initializing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                初始化中...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                初始化默认配置
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-slate-500">加载配置中...</p>
            </div>
          </div>
        ) : (
          <div className="flex gap-6">
            <div className="w-64 shrink-0">
              <Card>
                <CardContent className="p-2">
                  <nav className="space-y-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.key}
                        onClick={() => setActiveCategory(cat.key)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          activeCategory === cat.key
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="text-lg">{cat.icon}</span>
                        <span>{cat.label}</span>
                        {configs[cat.key] && (
                          <span
                            className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                              activeCategory === cat.key
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {configs[cat.key]?.filter((i: ConfigItem) => i.enabled).length || 0}/
                            {configs[cat.key]?.length || 0}
                          </span>
                        )}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{currentCategoryInfo?.icon}</span>
                    <CardTitle>{currentCategoryInfo?.label}</CardTitle>
                  </div>
                  {currentCategoryItems.length > 0 && (
                    <Button onClick={handleSaveAll} disabled={saving} size="sm">
                      {saving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      批量保存
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {currentCategoryItems.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                      <p>暂无配置项，请先初始化默认配置</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {currentCategoryItems.map((item: ConfigItem) => (
                        <div
                          key={item.key}
                          className="p-4 border border-slate-200 rounded-xl space-y-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <Label className="text-base font-medium text-slate-900">
                                  {item.label}
                                </Label>
                                {item.is_secret && (
                                  <Lock className="w-4 h-4 text-slate-400" />
                                )}
                              </div>
                              {item.description && (
                                <p className="text-sm text-slate-500 mt-1">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Label
                                htmlFor={`enabled-${item.key}`}
                                className="text-sm text-slate-600"
                              >
                                启用
                              </Label>
                              <Switch
                                id={`enabled-${item.key}`}
                                checked={item.enabled}
                                onCheckedChange={(checked: boolean) =>
                                  handleValueChange(activeCategory, item.key, 'enabled', checked)
                                }
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="relative flex-1">
                              {item.type === 'switch' ? (
                                <div className="flex items-center gap-3 h-10">
                                  <Switch
                                    checked={item.value === 'true'}
                                    onCheckedChange={(checked: boolean) =>
                                      handleValueChange(
                                        activeCategory,
                                        item.key,
                                        'value',
                                        checked ? 'true' : 'false'
                                      )
                                    }
                                    disabled={!item.enabled}
                                  />
                                  <span className="text-sm text-slate-500">
                                    {item.value === 'true' ? '开启' : '关闭'}
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <Input
                                    type={
                                      item.is_secret
                                        ? showSecrets[item.key]
                                          ? 'text'
                                          : 'password'
                                        : item.type === 'number'
                                        ? 'number'
                                        : 'text'
                                    }
                                    value={
                                      item.is_secret && !showSecrets[item.key]
                                        ? maskValue(item.value)
                                        : item.value
                                    }
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                      handleValueChange(
                                        activeCategory,
                                        item.key,
                                        'value',
                                        e.target.value
                                      )
                                    }
                                    placeholder={`请输入${item.label}`}
                                    disabled={!item.enabled}
                                    className={item.is_secret ? 'pr-10' : ''}
                                  />
                                  {item.is_secret && (
                                    <button
                                      type="button"
                                      onClick={() => toggleSecretVisibility(item.key)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                      {showSecrets[item.key] ? (
                                        <EyeOff className="w-4 h-4" />
                                      ) : (
                                        <Eye className="w-4 h-4" />
                                      )}
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTestConnection(activeCategory, item.key)}
                              disabled={!item.enabled || testingKey === item.key}
                            >
                              {testingKey === item.key ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Play className="w-4 h-4 mr-2" />
                              )}
                              测试连接
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSaveItem(activeCategory, item.key)}
                              disabled={saving || !item.enabled}
                            >
                              {saving ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4 mr-2" />
                              )}
                              保存
                            </Button>
                          </div>
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
