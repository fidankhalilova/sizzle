// components/BlogCard.tsx
import React from "react";

interface BlogCardProps {
  category: string;
  title: string;
  imageUrl: string;
  altText: string;
  readMoreLink: string;
  className?: string;
  imageClassName?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  category,
  title,
  imageUrl,
  altText,
  readMoreLink,
  className = "",
  imageClassName = "",
}) => {
  return (
    <div className={`mb-16 ${className}`}>
      {/* Category label with line */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-px bg-black"></div>
        <span className="text-xs font-medium tracking-[0.2em] text-gray-800 uppercase">
          {category}
        </span>
      </div>

      {/* Blog Card with Image */}
      <div className="mb-8">
        <div className="relative overflow-hidden mb-6 bg-gray-100">
          {/* Image Container - You can replace this with your own images */}
          <div className="h-64 md:h-80 lg:h-96 w-full">
            <img
              src={imageUrl}
              alt={altText}
              className={`w-full h-full object-cover ${imageClassName}`}
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif text-gray-900 leading-tight mb-6">
          {title}
        </h1>

        {/* Read More Link */}
        <div className="flex items-center gap-8">
          <a
            href={readMoreLink}
            className="inline-flex items-center gap-3 text-gray-900 font-medium text-sm tracking-wider hover:underline"
          >
            <span>READ MORE</span>
            <span className="text-xl">→</span>
          </a>
          <div className="w-16 h-px bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
