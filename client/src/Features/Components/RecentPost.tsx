// components/RecentPost.tsx
import React from "react";

interface RecentPostProps {
  title: string;
  date: string;
  hasBorder?: boolean;
}

const RecentPost: React.FC<RecentPostProps> = ({
  title,
  date,
  hasBorder = true,
}) => {
  return (
    <div className={`pb-6 ${hasBorder ? "border-b border-gray-200" : ""}`}>
      <h5 className="font-medium text-gray-900 mb-2 leading-snug">{title}</h5>
      <p className="text-xs text-gray-500 tracking-wide">{date}</p>
    </div>
  );
};

export default RecentPost;
