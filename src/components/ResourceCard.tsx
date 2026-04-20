import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Star, MessageCircle } from 'lucide-react';

interface ResourceCardProps {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  user_id: string;
  created_at: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  id,
  title,
  description,
  url,
  category,
  tags,
  user_id,
  created_at
}) => {
  return (
    <Link 
      to={`/resource/${id}`}
      className="group relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_60px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1"
    >
      {/* Card Content */}
      <div className="p-6">
        {/* Category Badge */}
        <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {category}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
              +{tags.length - 3}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-gray-500 text-sm">
            <div className="flex items-center gap-1">
              <Star size={14} />
              <span>4.8</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle size={14} />
              <span>12</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{new Date(created_at).toLocaleDateString()}</span>
            <ExternalLink size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  );
};

export default ResourceCard;