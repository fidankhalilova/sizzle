import { ShoppingBag } from "lucide-react";
import { useState } from "react";

const FeaturedProducts = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const products = [
    {
      id: 1,
      name: "Green Crochet Set With Blazer",
      price: "$ 100 USD",
      image:
        "https://cdn.prod.website-files.com/645a69e6ff9a558805774bf2/645d3d0385bd184674897b9b_image%20869-p-800.jpg",
    },
    {
      id: 2,
      name: "Leather Crossbody Bag",
      price: "$ 50 USD",
      image:
        "https://cdn.prod.website-files.com/645a69e6ff9a558805774bf2/645d3f698ca0a9562c7dba9e_image%20867.jpg",
    },
    {
      id: 3,
      name: "Glamour Pink Bow Dress",
      price: "$ 500 USD",
      image:
        "https://cdn.prod.website-files.com/645a69e6ff9a558805774bf2/645d39d8da4f2744fa9134b0_image%20872-p-800.jpg",
    },
    {
      id: 4,
      name: "Colorful Maxi Dress",
      price: "$ 40 USD",
      image:
        "https://cdn.prod.website-files.com/645a69e6ff9a558805774bf2/645d3bb923b2e6668455087d_image%20874-p-800.jpg",
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-12 my-12 md:my-20">
      <div className="flex flex-col justify-center items-center gap-5 md:gap-7">
        <div>
          <h1 className="text-3xl md:text-5xl font-semibold text-[#04322f] text-center">
            Check our selection
          </h1>
        </div>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          <button className="rounded-3xl bg-transparent text-[#04322f] border px-3 py-2 border-[#04322f] hover:bg-[#495f11] hover:border-[#495f11] hover:text-white duration-300 text-sm md:text-base">
            New Arrivals
          </button>
          <button className="rounded-3xl bg-transparent text-[#04322f] border px-3 py-2 border-[#04322f] hover:bg-[#495f11] hover:border-[#495f11] hover:text-white duration-300 text-sm md:text-base">
            Best Sellers
          </button>
          <button className="rounded-3xl bg-transparent text-[#04322f] border px-3 py-2 border-[#04322f] hover:bg-[#495f11] hover:border-[#495f11] hover:text-white duration-300 text-sm md:text-base">
            Swimwear
          </button>
          <button className="rounded-3xl bg-transparent text-[#04322f] border px-3 py-2 border-[#04322f] hover:bg-[#495f11] hover:border-[#495f11] hover:text-white duration-300 text-sm md:text-base">
            Denim Collection
          </button>
        </div>
      </div>

      <div
        id="cloth-line"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-12"
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            id="product-card"
            className="w-full"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="rounded-4xl relative overflow-hidden group">
              <img
                src={product.image}
                alt={product.name}
                className="rounded-4xl w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover overlay with options */}
              <div
                className={`absolute inset-0 bg-black/10 rounded-4xl transition-all duration-300 ${
                  hoveredIndex === index ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Hover controls - shown only on hover */}
              <div
                className={`absolute bottom-4 left-4 right-4 flex justify-between items-center transition-all duration-300 ${
                  hoveredIndex === index
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <div className="flex flex-col gap-2 w-full max-w-[200px] md:max-w-30">
                  <select
                    name="color"
                    id="color"
                    className="px-3 py-2 rounded-3xl bg-white text-sm md:text-base w-full"
                  >
                    <option value="default" selected>
                      Color
                    </option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                  </select>
                  <select
                    name="size"
                    id="size"
                    className="px-3 py-2 rounded-3xl bg-white text-sm md:text-base w-full"
                  >
                    <option value="default" selected>
                      Size
                    </option>
                    <option value="s">S</option>
                    <option value="m">M</option>
                    <option value="l">L</option>
                    <option value="xl">XL</option>
                  </select>
                </div>
                <div className="h-14 w-14 md:h-16 md:w-16 flex items-center justify-center rounded-full bg-white hover:bg-[#495f11] hover:text-white transition-colors duration-300 cursor-pointer shadow-lg">
                  <ShoppingBag className="h-6 w-6 md:h-7 md:w-7" />
                </div>
              </div>
            </div>
            <div className="mt-3 md:mt-4">
              <h4 className="text-lg md:text-2xl font-semibold text-[#04322f] hover:text-[#b94e31] duration-200 cursor-pointer">
                {product.name}
              </h4>
              <h5 className="text-base md:text-lg font-medium text-[#04322f] mt-1">
                {product.price}
              </h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
