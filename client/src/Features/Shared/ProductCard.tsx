// src/Components/ProductCard.tsx
import React, { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useAddToCart } from "../../Hooks/useAddToCart";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    colors: string[];
    sizes: string[];
    stock?: number;
    sku?: string;
  };
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const { handleAddToCart, isAdding, lastAddedItem } = useAddToCart();

  // Extract price from string like "$ 49.99 USD"
  const extractPrice = (priceString: string): number => {
    const match = priceString.match(/\$ (\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const price = extractPrice(product.price.toString());

  const handleAddToCartClick = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color before adding to cart");
      return;
    }

    handleAddToCart({
      id: product.id,
      name: product.name,
      price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      maxQuantity: product.stock || 99,
      sku: product.sku,
    });

    if (onAddToCart) {
      onAddToCart();
    }
  };

  // Check if this item was just added
  const isJustAdded =
    lastAddedItem?.id === product.id &&
    lastAddedItem?.size === selectedSize &&
    lastAddedItem?.color === selectedColor;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Success overlay */}
      {isJustAdded && (
        <div className="absolute inset-0 bg-green-500/90 z-10 rounded-2xl flex flex-col items-center justify-center text-white p-4 animate-fadeIn">
          <Check className="w-12 h-12 mb-2" />
          <p className="font-semibold text-lg">Added to Cart!</p>
          <p className="text-sm opacity-90">{product.name}</p>
          <p className="text-xs mt-2">
            Size: {selectedSize} | Color: {selectedColor}
          </p>
        </div>
      )}

      {/* Image Container */}
      <div className="relative overflow-hidden rounded-2xl mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Quick Add to Cart Button (appears on hover) */}
        <button
          onClick={handleAddToCartClick}
          disabled={isAdding || !selectedSize || !selectedColor}
          className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          } ${
            selectedSize && selectedColor
              ? "bg-[#04322f] text-white hover:bg-[#03201e]"
              : "bg-gray-400 text-white cursor-not-allowed"
          } ${isAdding ? "opacity-50 cursor-wait" : ""}`}
          title={
            selectedSize && selectedColor
              ? "Add to cart"
              : "Select size and color first"
          }
        >
          {isAdding ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <ShoppingBag className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm">{product.category}</p>
        <p className="font-bold text-[#04322f] text-lg">${price.toFixed(2)}</p>

        {/* Size Selection */}
        <div className="space-y-1">
          <label className="text-xs text-gray-600">Size:</label>
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-2 py-1 text-xs rounded border ${
                  selectedSize === size
                    ? "bg-[#04322f] text-white border-[#04322f]"
                    : "border-gray-300 hover:border-[#04322f]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="space-y-1">
          <label className="text-xs text-gray-600">Color:</label>
          <div className="flex flex-wrap gap-1">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full border-2 ${
                  selectedColor === color
                    ? "border-[#04322f] ring-2 ring-offset-1 ring-[#04322f]"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stock Indicator */}
      {product.stock && product.stock < 10 && (
        <div className="mt-2 text-xs text-amber-600">
          Only {product.stock} left in stock!
        </div>
      )}
    </div>
  );
};

export default ProductCard;
