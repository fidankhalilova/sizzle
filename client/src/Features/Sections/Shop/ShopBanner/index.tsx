import React from "react";

const ShopHeroBanner: React.FC = () => {
  return (
    <section className="relative w-full min-h-100 md:min-h-100 overflow-hidden">
      {/* Background Image Element - Replace with your image */}
      <div className="relative inset-0 z-0">
        <img
          src="https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/645e5cf1f8ec14bd7df0cb42_pexels-ron-lach-9586542%20(1).webp"
          alt="Shop Collection"
          className="w-full h-100 object-cover rounded-b-4xl"
        />

        <div className="absolute inset-0 bg-[#04322f] opacity-40 rounded-b-4xl z-4"></div>

        <div className="absolute z-10 bottom-0 left-0 w-full flex h-100 items-center justify-center">
          <p className="text-white text-5xl font-bold">Shop</p>
        </div>
      </div>
    </section>
  );
};

export default ShopHeroBanner;
