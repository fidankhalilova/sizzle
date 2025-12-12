// components/CategoryCard.tsx
import React from "react";

interface CategoryCardProps {
  iconLetter: string;
  title: string;
  className?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  iconLetter,
  title,
  className = "",
}) => {
  return (
    <div
      className={`pt-8 pb-10 border-l border-gray-300 first:border-l-0 ${className}`}
    >
      <div className="text-center">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-900 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center">
          <span className="text-white text-xs font-medium">{iconLetter}</span>
        </div>
        <span className="text-sm font-medium text-gray-900 tracking-wide">
          {title}
        </span>
      </div>
    </div>
  );
};

export default CategoryCard;
