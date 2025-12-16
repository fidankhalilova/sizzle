import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  Filter,
  X,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { productService } from "../../../../Services/api";
import type { Product } from "../../../../Types/types";
import { useAppDispatch, useAppSelector } from "../../../../Store/hooks";
import { addToCart } from "../../../../Store/Slices/cartSlice";
import LoginModal from "../../../Components/LoginModal";
import { useNavigate } from "react-router";

const ProductsPage: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState({
    categories: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
    genders: [] as string[],
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState<any>(null);
  const navigate = useNavigate();

  // Also update your handleProductClick to add logging:
  const handleProductClick = (productId: number, productName: string) => {
    console.log(`🔗 Navigating to product: ${productName} (ID: ${productId})`);
    navigate(`/product/${productId}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log("Fetching products from Strapi...");

        let data = await productService.getAllProducts();

        if (data.length === 0 || !data[0]?.image) {
          console.log("Trying alternative population method...");
          data = await productService.getAllProducts();
        }

        console.log("Products loaded:", data);

        // 🔍 IMPORTANT DEBUG INFO
        console.log("═══════════════════════════════════════");
        console.log("📋 AVAILABLE PRODUCT IDs:");
        data.forEach((p) => {
          console.log(`   ✓ ID: ${p.id} → Name: ${p.name}`);
        });
        console.log("═══════════════════════════════════════");

        if (data.length === 0) {
          throw new Error("No products loaded");
        }

        setProducts(data);

        // Rest of your existing code for initializing selectedOptions...
        const initialSelectedOptions: {
          [key: number]: { size: string; color: string };
        } = {};
        data.forEach((product) => {
          const sizes = Array.isArray(product.sizes)
            ? product.sizes
            : ["M", "L", "XL"];
          const colors = Array.isArray(product.colors)
            ? product.colors
            : ["Black", "White"];

          initialSelectedOptions[product.id] = {
            size: sizes[0] || "M",
            color: colors[0] || "Black",
          };
        });
        setSelectedOptions(initialSelectedOptions);

        // Extract filter options...
        const categories = Array.from(
          new Set(data.map((p) => p.category).filter(Boolean))
        );
        const colors = Array.from(
          new Set(
            data
              .flatMap((p) => (Array.isArray(p.colors) ? p.colors : []))
              .filter(Boolean)
          )
        );
        const sizes = Array.from(
          new Set(
            data
              .flatMap((p) => (Array.isArray(p.sizes) ? p.sizes : []))
              .filter(Boolean)
          )
        );
        const genders = Array.from(
          new Set(data.map((p) => p.gender).filter(Boolean))
        );

        const finalColors =
          colors.length > 0
            ? colors
            : ["Black", "White", "Red", "Blue", "Green", "Brown"];
        const finalSizes =
          sizes.length > 0 ? sizes : ["XS", "S", "M", "L", "XL"];
        const finalCategories =
          categories.length > 0
            ? categories
            : ["Dress", "Top", "Outerwear", "Swimwear"];
        const finalGenders =
          genders.length > 0 ? genders : ["Women", "Men", "Unisex"];

        setFilterOptions({
          categories: finalCategories,
          colors: finalColors,
          sizes: finalSizes,
          genders: finalGenders,
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          "Failed to load products from Strapi. Please check your API connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const [filters, setFilters] = useState({
    category: "",
    color: "",
    size: "",
    gender: "",
    priceRange: [0, 500],
  });

  // State for selected options per product
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: { size: string; color: string };
  }>({});

  // State for tracking which products are being added
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Fallback image
  const fallbackImage =
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80";

  // Fetch products from Strapi
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log("Fetching products from Strapi...");

        let data = await productService.getAllProducts();

        if (data.length === 0 || !data[0]?.image) {
          console.log("Trying alternative population method...");
          data = await productService.getAllProducts();
        }

        console.log("Products loaded:", data);
        console.log(
          "First product structure:",
          data[0] ? Object.keys(data[0]) : "No data"
        );

        if (data.length === 0) {
          throw new Error("No products loaded");
        }

        setProducts(data);

        // Initialize selected options for each product
        const initialSelectedOptions: {
          [key: number]: { size: string; color: string };
        } = {};
        data.forEach((product) => {
          // Ensure sizes and colors are arrays, provide defaults if not
          const sizes = Array.isArray(product.sizes)
            ? product.sizes
            : ["M", "L", "XL"];
          const colors = Array.isArray(product.colors)
            ? product.colors
            : ["Black", "White"];

          initialSelectedOptions[product.id] = {
            size: sizes[0] || "M",
            color: colors[0] || "Black",
          };
        });
        setSelectedOptions(initialSelectedOptions);

        // Extract unique filter options
        const categories = Array.from(
          new Set(data.map((p) => p.category).filter(Boolean))
        );

        const colors = Array.from(
          new Set(
            data
              .flatMap((p) => (Array.isArray(p.colors) ? p.colors : []))
              .filter(Boolean)
          )
        );

        const sizes = Array.from(
          new Set(
            data
              .flatMap((p) => (Array.isArray(p.sizes) ? p.sizes : []))
              .filter(Boolean)
          )
        );

        const genders = Array.from(
          new Set(data.map((p) => p.gender).filter(Boolean))
        );

        console.log("Filter options extracted:", {
          categories,
          colors,
          sizes,
          genders,
        });

        const finalColors =
          colors.length > 0
            ? colors
            : ["Black", "White", "Red", "Blue", "Green", "Brown"];
        const finalSizes =
          sizes.length > 0 ? sizes : ["XS", "S", "M", "L", "XL"];
        const finalCategories =
          categories.length > 0
            ? categories
            : ["Dress", "Top", "Outerwear", "Swimwear"];
        const finalGenders =
          genders.length > 0 ? genders : ["Women", "Men", "Unisex"];

        setFilterOptions({
          categories: finalCategories,
          colors: finalColors,
          sizes: finalSizes,
          genders: finalGenders,
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(
          "Failed to load products from Strapi. Please check your API connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle adding product to cart
  const handleAddToCart = async (product: Product) => {
    const selected = selectedOptions[product.id];

    if (!selected || !selected.size || !selected.color) {
      alert("Please select both size and color before adding to cart");
      return;
    }

    try {
      setAddingToCart(product.id);

      // IMPROVED PRICE PARSING - handles multiple formats
      let price = 0;

      console.log(
        "🔍 Original product.price:",
        product.price,
        "Type:",
        typeof product.price
      );

      if (typeof product.price === "string") {
        // Remove all non-numeric characters except decimal point
        const cleanedPrice = product.price.replace(/[^0-9.]/g, "");
        price = parseFloat(cleanedPrice);

        console.log("🔍 Cleaned price string:", cleanedPrice);
        console.log("🔍 Parsed price:", price);
      } else if (typeof product.price === "number") {
        price = product.price;
      }

      // Validate price
      if (isNaN(price) || price <= 0) {
        console.error(
          "❌ Invalid price detected:",
          product.price,
          "-> parsed as:",
          price
        );
        alert(`Invalid price for ${product.name}. Please contact support.`);
        return;
      }

      const cartItem = {
        id: product.id,
        name: product.name || "Unnamed Product",
        price: price,
        image: product.image || fallbackImage,
        size: selected.size,
        color: selected.color,
        quantity: 1,
      };

      console.log("✅ Final cart item:", cartItem);

      // Check if user is authenticated
      if (!isAuthenticated) {
        // Store the cart item and show login modal
        setPendingCartItem(cartItem);
        setShowLoginModal(true);

        // Show a message
        console.log("🔄 User not authenticated, showing login modal");
      } else {
        // Add directly to cart
        dispatch(addToCart(cartItem));
        alert(`${cartItem.name} added to cart! Price: $${price.toFixed(2)}`);
      }

      console.log("✅ Product processed successfully");
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    } finally {
      setAddingToCart(null);
    }
  };

  // Handle option selection
  const handleSelectOption = (
    productId: number,
    type: "size" | "color",
    value: string
  ) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [type]: value,
      },
    }));
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !filters.category || product.category === filters.category;
    const matchesColor =
      !filters.color ||
      (Array.isArray(product.colors) && product.colors.includes(filters.color));
    const matchesSize =
      !filters.size ||
      (Array.isArray(product.sizes) && product.sizes.includes(filters.size));
    const matchesGender = !filters.gender || product.gender === filters.gender;

    // Parse price for filtering
    let productPrice = 0;
    if (typeof product.price === "string") {
      const priceMatch = product.price.match(/\$ (\d+(\.\d+)?)/);
      productPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;
    } else if (typeof product.price === "number") {
      productPrice = product.price;
    }

    const matchesPrice =
      productPrice >= filters.priceRange[0] &&
      productPrice <= filters.priceRange[1];

    return (
      matchesSearch &&
      matchesCategory &&
      matchesColor &&
      matchesSize &&
      matchesGender &&
      matchesPrice
    );
  });

  const clearFilters = () => {
    setFilters({
      category: "",
      color: "",
      size: "",
      gender: "",
      priceRange: [0, 500],
    });
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 md:px-12 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04322f] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products from Strapi...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 md:px-12 py-12">
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#04322f] text-white rounded-full font-medium hover:bg-[#03201e] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-12 py-6 md:py-8">
      {/* Search and Filter Bar */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="relative grow">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#04322f] focus:border-transparent text-sm md:text-base"
            />
          </div>

          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-[#04322f] text-white rounded-full font-medium text-sm"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <button
            onClick={clearFilters}
            className="px-4 md:px-6 py-2.5 md:py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors text-sm md:text-base"
          >
            Clear All
          </button>
        </div>

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
          {filters.category && (
            <span className="px-2.5 py-1 bg-[#495f11] text-white rounded-full text-xs md:text-sm flex items-center gap-1">
              {filters.category}
              <button
                onClick={() => setFilters({ ...filters, category: "" })}
                className="ml-1"
              >
                ×
              </button>
            </span>
          )}
          {filters.color && (
            <span className="px-2.5 py-1 bg-[#b94e31] text-white rounded-full text-xs md:text-sm flex items-center gap-1">
              {filters.color}
              <button
                onClick={() => setFilters({ ...filters, color: "" })}
                className="ml-1"
              >
                ×
              </button>
            </span>
          )}
          {filters.size && (
            <span className="px-2.5 py-1 bg-gray-700 text-white rounded-full text-xs md:text-sm flex items-center gap-1">
              {filters.size}
              <button
                onClick={() => setFilters({ ...filters, size: "" })}
                className="ml-1"
              >
                ×
              </button>
            </span>
          )}
          {filters.gender && (
            <span className="px-2.5 py-1 bg-purple-600 text-white rounded-full text-xs md:text-sm flex items-center gap-1">
              {filters.gender}
              <button
                onClick={() => setFilters({ ...filters, gender: "" })}
                className="ml-1"
              >
                ×
              </button>
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Filters Sidebar */}
        <div
          className={`lg:w-1/4 ${
            showMobileFilters
              ? "block fixed inset-0 z-50 bg-white overflow-y-auto"
              : "hidden lg:block"
          }`}
        >
          <div
            className={`bg-gray-50 rounded-2xl md:rounded-3xl p-4 md:p-6 space-y-4 md:space-y-6 ${
              showMobileFilters ? "min-h-screen" : ""
            }`}
          >
            {/* Mobile Filter Header */}
            {showMobileFilters && (
              <div className="flex justify-between items-center mb-4 pb-4 border-b">
                <h3 className="text-xl font-bold text-[#04322f]">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-gray-500"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Desktop Filter Header */}
            {!showMobileFilters && (
              <h3 className="text-xl font-bold text-[#04322f] hidden lg:block">
                Filters
              </h3>
            )}

            {/* Categories Filter */}
            {filterOptions.categories.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 md:mb-3 text-sm md:text-base">
                  Categories
                </h4>
                <div className="space-y-1 md:space-y-2 max-h-48 md:max-h-60 overflow-y-auto pr-2">
                  {filterOptions.categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setFilters({ ...filters, category });
                        if (showMobileFilters) setShowMobileFilters(false);
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors text-sm md:text-base ${
                        filters.category === category
                          ? "bg-[#495f11] text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors Filter */}
            {filterOptions.colors.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 md:mb-3 text-sm md:text-base">
                  Colors
                </h4>
                <div className="grid grid-cols-5 md:grid-cols-4 gap-1.5 md:gap-2">
                  {filterOptions.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setFilters({ ...filters, color });
                        if (showMobileFilters) setShowMobileFilters(false);
                      }}
                      className={`h-7 md:h-8 rounded-full border ${
                        filters.color === color
                          ? "ring-2 ring-offset-1 md:ring-offset-2 ring-[#04322f]"
                          : ""
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase(),
                        borderColor:
                          color === "White" ? "#d1d5db" : "transparent",
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Filter */}
            {filterOptions.sizes.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 md:mb-3 text-sm md:text-base">
                  Size
                </h4>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {filterOptions.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setFilters({ ...filters, size });
                        if (showMobileFilters) setShowMobileFilters(false);
                      }}
                      className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full border text-xs md:text-sm ${
                        filters.size === size
                          ? "bg-[#04322f] text-white border-[#04322f]"
                          : "border-gray-300 hover:border-[#04322f]"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Gender Filter */}
            {filterOptions.genders.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 md:mb-3 text-sm md:text-base">
                  Gender
                </h4>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {filterOptions.genders.map((gender) => (
                    <button
                      key={gender}
                      onClick={() => {
                        setFilters({ ...filters, gender });
                        if (showMobileFilters) setShowMobileFilters(false);
                      }}
                      className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full border text-xs md:text-sm ${
                        filters.gender === gender
                          ? "bg-[#04322f] text-white border-[#04322f]"
                          : "border-gray-300 hover:border-[#04322f]"
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 md:mb-3 text-sm md:text-base">
                Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </h4>
              <input
                type="range"
                min="0"
                max="500"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priceRange: [
                      filters.priceRange[0],
                      parseInt(e.target.value),
                    ],
                  })
                }
                className="w-full h-1.5 md:h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs md:text-sm text-gray-600 mt-1.5 md:mt-2">
                <span>$0</span>
                <span>$500</span>
              </div>
            </div>

            {/* Mobile Apply Filters Button */}
            {showMobileFilters && (
              <div className="sticky bottom-0 left-0 right-0 bg-gray-50 pt-4 border-t">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 bg-[#04322f] text-white rounded-full font-medium text-base"
                >
                  Apply Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
            <p className="text-gray-600 text-sm md:text-base">
              Showing {filteredProducts.length} of {products.length} products
            </p>
            <div className="relative w-[200px] border border-gray-300 rounded-4xl">
              <select className="w-full sm:w-auto px-3 md:px-4 py-2 rounded-full outline-none text-sm md:text-base appearance-none bg-white pr-8">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
              <ChevronDown className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProducts.map((product, index) => {
              if (!product) return null;

              const selected = selectedOptions[product.id];
              const isAdding = addingToCart === product.id;

              return (
                <div
                  key={product.id}
                  id={`product-${product.id}`}
                  className="w-full group"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="rounded-3xl md:rounded-4xl relative overflow-hidden">
                    {/* Image Container - NOW CLICKABLE */}
                    <div
                      className="w-full h-[420px] relative cursor-pointer"
                      onClick={(e) => {
                        // Prevent navigation if clicking on controls
                        if (
                          (e.target as HTMLElement).closest("select, button")
                        ) {
                          return;
                        }
                        handleProductClick(product.id, product.name);
                      }}
                    >
                      <img
                        src={product.image || fallbackImage}
                        alt={product.name || "Product"}
                        className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = fallbackImage;
                        }}
                      />
                    </div>

                    {/* Hover overlay */}
                    <div
                      className={`absolute inset-0 bg-black/10 rounded-3xl md:rounded-4xl transition-all duration-300 pointer-events-none ${
                        hoveredIndex === index ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    {/* Hover controls */}
                    <div
                      className={`absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 flex justify-between items-center transition-all duration-300 ${
                        hoveredIndex === index
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-3 md:translate-y-4"
                      }`}
                    >
                      <div className="flex flex-col gap-1.5 md:gap-2 w-full max-w-40 md:max-w-[120px]">
                        {/* Color Selector */}
                        {product.colors && product.colors.length > 0 ? (
                          <select
                            value={selected?.color || ""}
                            onChange={(e) => {
                              e.stopPropagation(); // Prevent image click
                              handleSelectOption(
                                product.id,
                                "color",
                                e.target.value
                              );
                            }}
                            onClick={(e) => e.stopPropagation()} // Prevent image click
                            className="px-2.5 md:px-3 py-1.5 md:py-2 rounded-2xl md:rounded-3xl bg-white text-xs md:text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#04322f]"
                            disabled={isAdding}
                          >
                            {product.colors.map((color) => (
                              <option key={color} value={color}>
                                {color}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="px-2.5 md:px-3 py-1.5 md:py-2 rounded-2xl md:rounded-3xl bg-gray-100 text-xs md:text-sm w-full text-gray-500">
                            No colors
                          </div>
                        )}

                        {/* Size Selector */}
                        {product.sizes && product.sizes.length > 0 ? (
                          <select
                            value={selected?.size || ""}
                            onChange={(e) => {
                              e.stopPropagation(); // Prevent image click
                              handleSelectOption(
                                product.id,
                                "size",
                                e.target.value
                              );
                            }}
                            onClick={(e) => e.stopPropagation()} // Prevent image click
                            className="px-2.5 md:px-3 py-1.5 md:py-2 rounded-2xl md:rounded-3xl bg-white text-xs md:text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#04322f]"
                            disabled={isAdding}
                          >
                            {product.sizes.map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="px-2.5 md:px-3 py-1.5 md:py-2 rounded-2xl md:rounded-3xl bg-gray-100 text-xs md:text-sm w-full text-gray-500">
                            No sizes
                          </div>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent image click
                          handleAddToCart(product);
                        }}
                        disabled={
                          !selected?.size || !selected?.color || isAdding
                        }
                        className={`h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 flex items-center justify-center rounded-full transition-all duration-300 cursor-pointer shadow-lg ${
                          selected?.size && selected?.color && !isAdding
                            ? "bg-[#04322f] hover:bg-[#03201e] text-white"
                            : "bg-gray-300 cursor-not-allowed text-gray-500"
                        }`}
                        title={
                          selected?.size && selected?.color && !isAdding
                            ? "Add to cart"
                            : !selected?.size || !selected?.color
                            ? "Please select size and color"
                            : "Adding..."
                        }
                      >
                        {isAdding ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <ShoppingBag className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
                        )}
                      </button>
                    </div>

                    {/* Selected options badge */}
                    {selected?.size && selected?.color && (
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <div className="flex gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
                          <span>{selected.size}</span>
                          <span className="text-gray-400">•</span>
                          <span
                            className="w-3 h-3 rounded-full inline-block border"
                            style={{
                              backgroundColor: selected.color.toLowerCase(),
                              borderColor:
                                selected.color === "White"
                                  ? "#d1d5db"
                                  : "transparent",
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info - ALSO CLICKABLE */}
                  <div
                    className="mt-2.5 md:mt-3 lg:mt-4 cursor-pointer"
                    onClick={() => handleProductClick(product.id, product.name)}
                  >
                    <h4 className="text-base md:text-lg lg:text-xl font-semibold text-[#04322f] hover:text-[#b94e31] duration-200 line-clamp-1">
                      {product.name || "Unnamed Product"}
                    </h4>
                    <p className="text-gray-500 text-xs md:text-sm mt-0.5 line-clamp-1">
                      {product.category || "Uncategorized"}
                    </p>
                    <h5 className="text-sm md:text-base lg:text-lg font-medium text-[#04322f] mt-1.5 md:mt-2">
                      {product.price || "$ 0.00 USD"}
                    </h5>

                    {/* Selected options display */}
                    {selected && selected.size && selected.color && (
                      <div className="mt-1 flex flex-wrap gap-1 text-xs text-gray-600">
                        <span className="px-2 py-0.5 bg-gray-100 rounded">
                          Size: {selected.size}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded">
                          Color: {selected.color}
                          <span
                            className="w-3 h-3 rounded-full inline-block border"
                            style={{
                              backgroundColor: selected.color.toLowerCase(),
                              borderColor:
                                selected.color === "White"
                                  ? "#d1d5db"
                                  : "transparent",
                            }}
                          />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setPendingCartItem(null);
        }}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          // You might want to navigate to register or show register modal
          // For now, just close
        }}
        onForgotPassword={() => {
          setShowLoginModal(false);
          console.log("Forgot password clicked");
        }}
        onLoginSuccess={() => {
          // When login is successful, add the pending item to cart
          if (pendingCartItem) {
            dispatch(addToCart(pendingCartItem));
            alert(`${pendingCartItem.name} has been added to your cart!`);
            setPendingCartItem(null);
          }
          setShowLoginModal(false);
        }}
      />
    </div>
  );
};

export default ProductsPage;
