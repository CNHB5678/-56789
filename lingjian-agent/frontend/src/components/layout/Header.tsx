import { useState } from 'react';
import { Search, Menu } from 'lucide-react';
import { useProjectStore } from '@/stores/projectStore';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentProject } = useProjectStore();

  return (
    <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden">
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索项目、素材..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg
                       text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {currentProject && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
            <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
              {currentProject.name}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
