'use client';

import React, { useState } from 'react';
import {
  User,
  Camera,
  Lock,
  MessageCircle,
  Music,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/auth-store';
import { put } from '@/lib/api';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [wechatBound] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('基本信息保存功能开发中');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('两次输入的新密码不一致');
      return;
    }
    alert('修改密码功能开发中');
  };

  const handleWechatAction = () => {
    alert(wechatBound ? '解绑微信功能开发中' : '绑定微信功能开发中');
  };

  return (
    <WorkspaceLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              基本信息
            </CardTitle>
            <CardDescription>
              更新您的个人资料和头像
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatar}
                        alt={nickname || user.phone}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-slate-400" />
                    )}
                  </div>
                  <button
                    type="button"
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">头像</p>
                  <p className="text-sm text-slate-500 mt-1">
                    点击头像上传新图片，支持 JPG、PNG 格式
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">昵称</Label>
                <Input
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="请输入昵称"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <Input
                  id="phone"
                  value={user?.phone || ''}
                  disabled
                  className="bg-slate-50 text-slate-500"
                />
                <p className="text-xs text-slate-400">手机号不可修改</p>
              </div>

              <Button type="submit">保存更改</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              修改密码
            </CardTitle>
            <CardDescription>
              定期更换密码可以保护账号安全
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="old-password">旧密码</Label>
                <Input
                  id="old-password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="请输入旧密码"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">新密码</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="请输入新密码（至少6位）"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">确认新密码</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入新密码"
                />
              </div>

              <Button type="submit">修改密码</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-600" />
              微信绑定
            </CardTitle>
            <CardDescription>
              绑定微信后可以使用微信快捷登录
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-8 h-8 text-green-600" />
                <div>
                  <p className="font-medium text-slate-900">微信</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    {wechatBound ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        已绑定
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-slate-400" />
                        未绑定
                      </>
                    )}
                  </p>
                </div>
              </div>
              <Button
                variant={wechatBound ? 'outline' : 'default'}
                onClick={handleWechatAction}
              >
                {wechatBound ? '解绑' : '绑定'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-600" />
              音色收藏
            </CardTitle>
            <CardDescription>
              管理您收藏的AI音色
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">
              <Music className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">收藏的音色会显示在这里</p>
              <p className="text-sm text-slate-400 mt-1">功能开发中...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </WorkspaceLayout>
  );
}
