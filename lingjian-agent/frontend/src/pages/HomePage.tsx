import { FolderOpen, Plus, Clock, Video } from 'lucide-react';
import { useProjectStore } from '@/stores';

export default function HomePage() {
  const { projects } = useProjectStore();

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">我的项目</h1>
        <button className="btn btn-primary">
          <Plus className="w-5 h-5" />
          新建项目
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl">
          <FolderOpen className="w-16 h-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
            暂无项目
          </h2>
          <p className="text-gray-500 mb-4">创建一个新项目开始创作</p>
          <button className="btn btn-primary">
            <Plus className="w-5 h-5" />
            创建项目
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="card cursor-pointer hover:shadow-xl transition-shadow duration-200"
            >
              <div className="aspect-video bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg mb-3 flex items-center justify-center">
                <Video className="w-12 h-12 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {project.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                {project.description || '暂无描述'}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {new Date(project.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
