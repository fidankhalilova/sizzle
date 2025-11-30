import React from "react";

const HeroBanner: React.FC = () => {
  return (
    <section className="relative w-full h-210 overflow-hidden bg-[#04322f] rounded-b-4xl">
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Unbeatable comfort
        </h1>
        <p className="text-xl md:text-2xl text-white max-w-2xl mb-8">
          With our versatile product range, we are here to help you go places in
          style, without any compromises.
        </p>
        <button className="bg-[#b94e31] hover:bg-[#495f11] text-[20px] text-white font-semibold py-3 px-8 rounded-4xl transition duration-600 transform hover:scale-105">
          Explore collection
        </button>
      </div>

      <div className="absolute top-10 left-10 w-24 h-24 bg-blue-200 rounded-full opacity-30"></div>
      <div className="absolute bottom-20 right-16 w-32 h-32 bg-indigo-200 rounded-full opacity-40"></div>

      <div className="absolute top-1/4 right-1/4 transform -translate-y-1/2 w-48 h-48">
        <div className="w-full h-full bg-blue-100 rounded-2xl shadow-lg rotate-12 flex items-center justify-center">
          <span className="text-blue-400 text-sm">Product Image 1</span>
        </div>
      </div>

      <div className="absolute bottom-1/4 left-1/4 transform translate-y-1/2 w-56 h-56">
        <div className="w-full h-full bg-indigo-100 rounded-2xl shadow-lg -rotate-6 flex items-center justify-center">
          <span className="text-indigo-400 text-sm">Product Image 2</span>
        </div>
      </div>

      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>
    </section>
  );
};

export default HeroBanner;
