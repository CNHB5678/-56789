import React from 'react';
import { Link } from 'react-router-dom';
import {
  Pencil,
  Palette,
  Video,
  Code2,
  Briefcase,
  BookOpen,
  Mic,
  Image as ImageIcon,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  toolCount: number;
}

const getCategoryIcon = (iconName: string) => {
  const icons = {
    pencil: Pencil,
    palette: Palette,
    video: Video,
    code: Code2,
    briefcase: Briefcase,
    book: BookOpen,
    microphone: Mic,
    image: ImageIcon,
    zap: Zap
  };
  return icons[iconName as keyof typeof icons] || Zap;
};

const getCategoryGradient = (index: number) => {
  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-green-500 to-emerald-600',
    'from-orange-500 to-red-600',
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600',
    'from-pink-500 to-rose-600',
    'from-teal-500 to-cyan-600',
    'from-amber-500 to-orange-600'
  ];
  return gradients[index % gradients.length];
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  toolCount
}) => {
  const Icon = getCategoryIcon(category.icon);
  const gradientIndex = category.id.charCodeAt(0) % 9;

  return (
    <Link
      to={`/category/${category.id}`}
      className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
    >
      {/* Background gradient effect */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getCategoryGradient(gradientIndex)} opacity-10 group-hover:opacity-20 transition-opacity rounded-full -mr-16 -mt-16`}
      />

      <div className="relative">
        {/* Icon */}
        <div
          className={`w-14 h-14 bg-gradient-to-br ${getCategoryGradient(gradientIndex)} rounded-xl flex items-center justify-center mb-4 text-white shadow-lg`}
        >
          <Icon size={28} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {category.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
          {category.description}
        </p>

        {/* Subcategories */}
        {category.subCategories && category.subCategories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {category.subCategories.slice(0, 3).map((sub) => (
              <span
                key={sub}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs"
              >
                {sub}
              </span>
            ))}
            {category.subCategories.length > 3 && (
              <span className="px-2 py-0.5 text-gray-400 dark:text-gray-500 text-xs">
                +{category.subCategories.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {toolCount} 个工具
          </span>
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm font-medium">查看全部</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
};
