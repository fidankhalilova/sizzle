import React from "react";

const MarqueeBanner: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-[#495f11] py-6">
      <div
        className="whitespace-nowrap flex items-center"
        style={{
          animation: "marquee 10s linear infinite",
        }}
      >
        <span className="text-2xl md:text-4xl font-semibold text-white mx-8 tracking-wide">
          Be the first to know when new arrivals are available! Subscribe to
          receive notifications!
        </span>
        <span className="text-2xl md:text-4xl font-semibold text-white mx-8 tracking-wide">
          Be the first to know when new arrivals are available! Subscribe to
          receive notifications!
        </span>
        <span className="text-2xl md:text-4xl font-semibold text-white mx-8 tracking-wide">
          Be the first to know when new arrivals are available! Subscribe to
          receive notifications!
        </span>
        <span className="text-2xl md:text-4xl font-semibold text-white mx-8 tracking-wide">
          Be the first to know when new arrivals are available! Subscribe to
          receive notifications!
        </span>
      </div>
    </div>
  );
};

export default MarqueeBanner;
