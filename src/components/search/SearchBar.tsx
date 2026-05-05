import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useToolStore } from '../../store/useToolStore';

interface SearchBarProps {
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '搜索 AI 工具、功能、关键词...',
  size = 'md',
  className = ''
}) => {
  const { searchQuery, setSearchQuery } = useToolStore();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 200);

    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  useEffect(() => {
    if (searchQuery !== localQuery) {
      setLocalQuery(searchQuery);
    }
  }, [searchQuery]);

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const sizeClasses = {
    sm: 'h-9 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-lg'
  };

  const iconSizes = {
    sm: 18,
    md: 20,
    lg: 24
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search
          size={iconSizes[size]}
          className="text-gray-400 dark:text-gray-500"
        />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${sizeClasses[size]} pl-12 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
      />
      {localQuery && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X size={iconSizes[size]} />
        </button>
      )}
    </div>
  );
};
