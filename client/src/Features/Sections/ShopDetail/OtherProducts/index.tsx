import { ShoppingBag, MoveRight } from "lucide-react";
import { useState } from "react";

const OtherProducts = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedColors, setSelectedColors] = useState<{
    [key: number]: string;
  }>({});
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>(
    {}
  );

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

  const handleColorChange = (productId: number, color: string) => {
    setSelectedColors((prev) => ({ ...prev, [productId]: color }));
  };

  const handleSizeChange = (productId: number, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product: any) => {
    const cartItem = {
      ...product,
      color: selectedColors[product.id] || "default",
      size: selectedSizes[product.id] || "default",
    };
    console.log("Added to cart:", cartItem);
    // Add your cart logic here
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 my-8 md:my-12 lg:my-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:gap-6">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#04322f] text-left">
            Customers also love
          </h1>
        </div>
        <div className="w-full sm:w-auto">
          <button className="text-[#495f11] text-base sm:text-lg md:text-xl lg:text-2xl flex gap-2 items-center hover:gap-3 transition-all duration-300">
            View More <MoveRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="w-full"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="rounded-3xl lg:rounded-4xl relative overflow-hidden group">
              <img
                src={product.image}
                alt={product.name}
                className="rounded-3xl lg:rounded-4xl w-full h-[280px] sm:h-80 md:h-[350px] lg:h-[400px] xl:h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover overlay with options */}
              <div
                className={`absolute inset-0 bg-black/10 rounded-3xl lg:rounded-4xl transition-all duration-300 ${
                  hoveredIndex === index
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              />

              {/* Hover controls - shown only on hover */}
              <div
                className={`absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-end gap-2 sm:gap-0 transition-all duration-300 ${
                  hoveredIndex === index
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                <div className="flex flex-col gap-2 w-full sm:w-auto sm:max-w-[140px] md:max-w-40">
                  <select
                    name="color"
                    value={selectedColors[product.id] || "default"}
                    onChange={(e) =>
                      handleColorChange(product.id, e.target.value)
                    }
                    className="px-3 py-2 rounded-2xl lg:rounded-3xl bg-white text-xs sm:text-sm md:text-base w-full"
                  >
                    <option value="default">Color</option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                  </select>
                  <select
                    name="size"
                    value={selectedSizes[product.id] || "default"}
                    onChange={(e) =>
                      handleSizeChange(product.id, e.target.value)
                    }
                    className="px-3 py-2 rounded-2xl lg:rounded-3xl bg-white text-xs sm:text-sm md:text-base w-full"
                  >
                    <option value="default">Size</option>
                    <option value="s">S</option>
                    <option value="m">M</option>
                    <option value="l">L</option>
                    <option value="xl">XL</option>
                  </select>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 flex items-center justify-center rounded-full bg-white hover:bg-[#495f11] hover:text-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl active:scale-95"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </button>
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <h4 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-[#04322f] hover:text-[#b94e31] duration-200 cursor-pointer line-clamp-1">
                {product.name}
              </h4>
              <h5 className="text-sm sm:text-base md:text-lg font-medium text-[#04322f] mt-1">
                {product.price}
              </h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtherProducts;
