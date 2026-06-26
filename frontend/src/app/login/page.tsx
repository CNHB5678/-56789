'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as Tabs from '@radix-ui/react-tabs';
import { Eye, EyeOff, Phone, Lock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/lib/auth-store';
import { post } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<'code' | 'password'>('code');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/workspace');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validatePhone = (phone: string) => {
    return /^1[3-9]\d{9}$/.test(phone);
  };

  const handleSendCode = async () => {
    if (!validatePhone(phone)) {
      toast({
        variant: 'destructive',
        title: '请输入正确的手机号',
      });
      return;
    }

    setIsSendingCode(true);
    try {
      await post('/auth/send-code', { phone, type: 'login' });
      setCountdown(60);
      toast({
        title: '验证码已发送',
        description: '请查收短信',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '发送失败',
        description: error.response?.data?.message || '请稍后重试',
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const getErrorMessage = (error: any): string => {
    const detail = error.response?.data?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      return detail[0]?.msg || '请检查输入信息';
    }
    return error.response?.data?.message || '请检查手机号和验证码/密码';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone(phone)) {
      toast({
        variant: 'destructive',
        title: '请输入正确的手机号',
      });
      return;
    }

    if (activeTab === 'code' && !code) {
      toast({
        variant: 'destructive',
        title: '请输入验证码',
      });
      return;
    }

    if (activeTab === 'password' && !password) {
      toast({
        variant: 'destructive',
        title: '请输入密码',
      });
      return;
    }

    setIsLoading(true);
    try {
      const loginData = activeTab === 'code' 
        ? { phone, code }
        : { phone, password };
      
      await login(loginData);
      toast({
        title: '登录成功',
      });
      router.push('/workspace');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '登录失败',
        description: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">欢迎回来</CardTitle>
          <CardDescription>登录您的账号开始创作</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs.Root value={activeTab} onValueChange={(v) => setActiveTab(v as 'code' | 'password')}>
            <Tabs.List className="flex w-full bg-slate-100 rounded-lg p-1 mb-6">
              <Tabs.Trigger
                value="code"
                className={cn(
                  'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all',
                  activeTab === 'code'
                    ? 'bg-white shadow-sm text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                验证码登录
              </Tabs.Trigger>
              <Tabs.Trigger
                value="password"
                className={cn(
                  'flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all',
                  activeTab === 'password'
                    ? 'bg-white shadow-sm text-slate-900'
                    : 'text-slate-500 hover:text-slate-700'
                )}
              >
                密码登录
              </Tabs.Trigger>
            </Tabs.List>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="请输入手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    maxLength={11}
                  />
                </div>
              </div>

              <Tabs.Content value="code" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="code">验证码</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="code"
                        type="text"
                        placeholder="请输入验证码"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="pl-10"
                        maxLength={6}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSendCode}
                      disabled={countdown > 0 || isSendingCode}
                      className="whitespace-nowrap"
                    >
                      {countdown > 0 ? `${countdown}秒后重发` : '获取验证码'}
                    </Button>
                  </div>
                </div>
              </Tabs.Content>

              <Tabs.Content value="password" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="请输入密码"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </Tabs.Content>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </form>
          </Tabs.Root>

          <div className="mt-6 flex flex-col items-center gap-2 text-sm">
            <Link
              href="/forgot-password"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              忘记密码？
            </Link>
            <p className="text-slate-500">
              还没有账号？{' '}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                立即注册
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
