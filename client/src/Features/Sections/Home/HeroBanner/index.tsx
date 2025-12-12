import React from "react";

const HeroBanner: React.FC = () => {
  return (
    <section className="relative w-full h-[600px] md:h-[840px] overflow-hidden bg-[#04322f] rounded-b-4xl z-1">
      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white mb-6">
          Unbeatable comfort
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-white max-w-3xl mb-10 px-4">
          With our versatile product range, we are here to help you go places in
          style, without any compromises.
        </p>
        <button className="bg-[#b94e31] hover:bg-[#495f11] text-xl md:text-2xl text-white font-semibold py-4 px-12 rounded-4xl transition duration-600 transform hover:scale-105 shadow-lg">
          Explore collection
        </button>
      </div>

      {/* Decorative circles */}
      <div className="absolute top-16 left-16 w-20 h-20 bg-blue-200 rounded-full opacity-30"></div>
      <div className="absolute bottom-32 right-20 w-28 h-28 bg-indigo-200 rounded-full opacity-40"></div>

      {/* Image 1 - Top Right (Large, rotated right) */}
      <div className="absolute top-24 right-32 w-64 h-80 z-10">
        <div className="w-full h-full bg-white rounded-3xl shadow-2xl rotate-12 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Running Shoes"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Image 2 - Bottom Left (Large, rotated left) */}
      <div className="absolute bottom-20 left-32 w-72 h-96 z-10">
        <div className="w-full h-full bg-white rounded-3xl shadow-2xl -rotate-12 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Casual Sneakers"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Image 3 - Center Left (Medium, rotated right) */}
      <div className="absolute top-1/2 left-16 transform -translate-y-1/2 w-48 h-60 z-0 opacity-80">
        <div className="w-full h-full bg-white rounded-2xl shadow-lg rotate-6 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Sports Sandals"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Image 4 - Center Right (Medium, rotated left) */}
      <div className="absolute top-1/2 right-16 transform -translate-y-1/2 w-52 h-64 z-0 opacity-80">
        <div className="w-full h-full bg-white rounded-2xl shadow-lg -rotate-3 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Formal Shoes"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Image 5 - Bottom Center Small (Very small, near button) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-32 opacity-70">
        <div className="w-full h-full bg-white rounded-xl shadow-md rotate-3 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Kids Shoes"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Optional: Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#04322f] opacity-20"></div>
    </section>
  );
};

export default HeroBanner;
