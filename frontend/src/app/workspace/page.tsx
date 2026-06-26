'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutGrid,
  List,
  Trash2,
  Plus,
  Play,
  Copy,
  Download,
  Trash,
  Clock,
  FileVideo,
} from 'lucide-react';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { get, del } from '@/lib/api';

type ProjectStatus = 'queued' | 'processing' | 'waiting_confirm' | 'completed' | 'failed';

interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
  duration?: number;
  created_at: string;
  updated_at?: string;
  thumbnail?: string;
  mode: 'audio' | 'text';
}

interface WorkspaceStats {
  total_projects: number;
  completed_projects: number;
  monthly_usage: number;
  monthly_quota: number;
}

const statusLabels: Record<ProjectStatus, string> = {
  queued: '排队中',
  processing: '处理中',
  waiting_confirm: '待校对',
  completed: '已完成',
  failed: '失败',
};

const formatDuration = (seconds?: number): string => {
  if (!seconds) return '--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const statusFilters: { value: ProjectStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'processing', label: '进行中' },
  { value: 'waiting_confirm', label: '待校对' },
  { value: 'queued', label: '编辑中' },
  { value: 'completed', label: '已完成' },
  { value: 'failed', label: '失败' },
];

export default function WorkspacePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeStatus, setActiveStatus] = useState<ProjectStatus | 'all'>('all');

  const { data: stats, isLoading: statsLoading } = useQuery<WorkspaceStats>({
    queryKey: ['workspace-stats'],
    queryFn: () => get('/v1/workspace/stats'),
  });

  const { data: projects, isLoading: projectsLoading, refetch } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: () => get('/v1/projects'),
  });

  const filteredProjects = projects?.filter((p) => {
    if (activeStatus === 'all') return true;
    if (activeStatus === 'processing') return p.status === 'processing';
    return p.status === activeStatus;
  }) || [];

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个项目吗？')) {
      await del(`/v1/projects/${id}`);
      refetch();
    }
  };

  const handleDuplicate = async (id: string) => {
    alert(`复制项目 ${id}（功能开发中）`);
  };

  const handleDownload = (id: string) => {
    alert(`下载项目 ${id}（功能开发中）`);
  };

  const handleContinue = (id: string) => {
    alert(`继续编辑项目 ${id}（跳转到校对页，功能开发中）`);
  };

  if (projectsLoading || statsLoading) {
    return (
      <WorkspaceLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">加载中...</div>
        </div>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">个人空间</h2>
            <p className="text-sm text-slate-500 mt-1">管理您的视频项目</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/workspace/trash">
              <Button variant="outline" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                回收站
              </Button>
            </Link>
            <Link href="/create">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                创建项目
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">总项目数</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {stats?.total_projects ?? 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileVideo className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">已完成</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {stats?.completed_projects ?? 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">本月用量</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {stats?.monthly_usage ?? 0}
                    <span className="text-base font-normal text-slate-400">
                      /{stats?.monthly_quota ?? 0}
                    </span>
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">我的项目</CardTitle>
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className={viewMode === 'grid' ? '' : 'text-slate-600 hover:text-slate-900'}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className={viewMode === 'list' ? '' : 'text-slate-600 hover:text-slate-900'}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="all"
              value={activeStatus}
              onValueChange={(v) => setActiveStatus(v as ProjectStatus | 'all')}
              className="w-full"
            >
              <TabsList className="mb-4">
                {statusFilters.map((filter) => (
                  <TabsTrigger key={filter.value} value={filter.value}>
                    {filter.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={activeStatus} className="mt-0">
                {filteredProjects.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileVideo className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 mb-4">还没有项目，去创建</p>
                    <Link href="/create">
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        创建项目
                      </Button>
                    </Link>
                  </div>
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map((project) => (
                      <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                        <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 relative">
                          {project.thumbnail ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={project.thumbnail}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileVideo className="w-12 h-12 text-slate-400" />
                            </div>
                          )}
                          <div className="absolute top-3 right-3">
                            <Badge variant={project.status}>
                              {statusLabels[project.status]}
                            </Badge>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2 gap-1">
                            {project.status === 'waiting_confirm' || project.status === 'queued' ? (
                              <Button
                                size="icon"
                                variant="secondary"
                                className="w-8 h-8"
                                onClick={() => handleContinue(project.id)}
                              >
                                <Play className="w-4 h-4" />
                              </Button>
                            ) : null}
                            <Button
                              size="icon"
                              variant="secondary"
                              className="w-8 h-8"
                              onClick={() => handleDuplicate(project.id)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            {project.status === 'completed' && (
                              <Button
                                size="icon"
                                variant="secondary"
                                className="w-8 h-8"
                                onClick={() => handleDownload(project.id)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="secondary"
                              className="w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(project.id)}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium text-slate-900 truncate mb-2">
                            {project.title}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDuration(project.duration)}
                            </div>
                            <span>{formatDate(project.created_at)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b">
                          <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">
                            项目名称
                          </th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">
                            状态
                          </th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">
                            时长
                          </th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">
                            创建时间
                          </th>
                          <th className="text-right px-4 py-3 text-sm font-medium text-slate-500">
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProjects.map((project) => (
                          <tr key={project.id} className="border-b hover:bg-slate-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded flex items-center justify-center">
                                  <FileVideo className="w-5 h-5 text-slate-400" />
                                </div>
                                <span className="font-medium text-slate-900">
                                  {project.title}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={project.status}>
                                {statusLabels[project.status]}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-500">
                              {formatDuration(project.duration)}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-500">
                              {formatDate(project.created_at)}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                {(project.status === 'waiting_confirm' || project.status === 'queued') && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8"
                                    onClick={() => handleContinue(project.id)}
                                  >
                                    <Play className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-8 h-8"
                                  onClick={() => handleDuplicate(project.id)}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                                {project.status === 'completed' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="w-8 h-8"
                                    onClick={() => handleDownload(project.id)}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-8 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDelete(project.id)}
                                >
                                  <Trash className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </WorkspaceLayout>
  );
}
