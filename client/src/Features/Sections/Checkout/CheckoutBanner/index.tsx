import React from "react";

const CheckoutHeroBanner: React.FC = () => {
  return (
    <section className="relative w-full min-h-40 sm:min-h-40 md:min-h-40 lg:min-h-40 overflow-hidden">
      <div className="relative inset-0 z-0">
        <img
          src="https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/64778b71c9b8dae9c08b3d52_priscilla-du-preez-dlxLGIy-2VU-unsplash.webp"
          alt="Shop Collection"
          className="w-full h-40 object-cover rounded-b-4xl"
        />
        <div className="absolute inset-0 bg-[#04322f] opacity-40 rounded-b-4xl z-4"></div>
      </div>
    </section>
  );
};

export default CheckoutHeroBanner;
