import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showValue?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  maxRating = 5,
  size = 16,
  showValue = true
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            size={size}
            className="fill-yellow-400 text-yellow-400"
          />
        ))}
        {hasHalfStar && (
          <StarHalf size={size} className="fill-yellow-400 text-yellow-400" />
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={size}
            className="text-gray-300 dark:text-gray-600"
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
