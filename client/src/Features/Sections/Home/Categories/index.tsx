import { MoveRight } from "lucide-react";

const Categories = () => {
  return (
    <div className="container mx-auto px-12 my-20">
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-5xl font-semibold text-[#04322f]">
            Explore by categories
          </h1>
          <button className="text-[#495f11] text-2xl flex gap-2 items-center">
            View More <MoveRight />
          </button>
        </div>
        <div className="my-10 grid grid-rows-3 grid-cols-none gap-5 md:grid-cols-3 md:grid-rows-none">
          <div id="category-box" className="relative w-full">
            <div className="relative rounded-4xl overflow-hidden">
              <img
                src="https://cdn.prod.website-files.com/645a69e6ff9a558805774bf2/645e27a2a712b0144adc27fa_image%20860-p-800.jpg"
                alt=""
                className="rounded-4xl w-full h-auto aspect-4/3 md:h-[370px] object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 md:bottom-0 md:left-0 md:right-0">
              <div className="w-full px-6 md:px-10 py-3 md:py-2.5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg">
                <h1 className="text-lg md:text-2xl flex justify-between items-center text-[#04322f] font-semibold">
                  <span className="truncate">New Arrivals</span>
                  <MoveRight className="w-5 h-5 md:w-6 md:h-6 shrink-0 ml-2" />
                </h1>
              </div>
            </div>
          </div>
          <div id="category-box" className="relative w-full">
            <div className="relative rounded-4xl overflow-hidden">
              <img
                src="https://cdn.prod.website-files.com/645a69e6ff9a558805774bf2/645e27a2a712b0144adc27fa_image%20860-p-800.jpg"
                alt=""
                className="rounded-4xl w-full h-auto aspect-4/3 md:h-[370px] object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 md:bottom-0 md:left-0 md:right-0">
              <div className="w-full px-6 md:px-10 py-3 md:py-2.5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg">
                <h1 className="text-lg md:text-2xl flex justify-between items-center text-[#04322f] font-semibold">
                  <span className="truncate">New Arrivals</span>
                  <MoveRight className="w-5 h-5 md:w-6 md:h-6 shrink-0 ml-2" />
                </h1>
              </div>
            </div>
          </div>
          <div id="category-box" className="relative w-full">
            <div className="relative rounded-4xl overflow-hidden">
              <img
                src="https://cdn.prod.website-files.com/645a69e6ff9a558805774bf2/645e27a2a712b0144adc27fa_image%20860-p-800.jpg"
                alt=""
                className="rounded-4xl w-full h-auto aspect-4/3 md:h-[370px] object-cover"
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 md:bottom-0 md:left-0 md:right-0">
              <div className="w-full px-6 md:px-10 py-3 md:py-2.5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg">
                <h1 className="text-lg md:text-2xl flex justify-between items-center text-[#04322f] font-semibold">
                  <span className="truncate">New Arrivals</span>
                  <MoveRight className="w-5 h-5 md:w-6 md:h-6 shrink-0 ml-2" />
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
