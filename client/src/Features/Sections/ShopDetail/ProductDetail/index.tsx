import ProductTabs from "../../../Components/ProductsTab";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { productService } from "../../../../Services/api";
import type { Product } from "../../../../Types/types";
import { AlertCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../../Store/hooks";
import { addToCart, addToPending } from "../../../../Store/Slices/cartSlice";
import LoginModal from "../../../Components/LoginModal";
import ImageModal from "../../../Components/ImageModal"; // Adjust path as needed

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user: _user } = useAppSelector(
    (state) => state.auth
  );

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableIds, setAvailableIds] = useState<number[]>([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showImageModal, setShowImageModal] = useState(false);

  // Fallback image
  const fallbackImage =
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80";

  // Fetch product data from Strapi
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("No product ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(
          `🔍 ProductDetail: Attempting to fetch product with ID: ${id}`
        );

        const productData = await productService.getProductById(Number(id));

        if (!productData) {
          console.error(`❌ Product with ID ${id} not found`);

          // Fetch available product IDs to show user
          const ids = await productService.getAvailableProductIds();
          setAvailableIds(ids);

          setError(
            `Product with ID ${id} not found. This product may have been deleted or the ID is incorrect.`
          );
          setLoading(false);
          return;
        }

        console.log("✅ Product loaded successfully:", productData);
        setProduct(productData);

        // Set default selections
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }

        setError(null);
      } catch (err: any) {
        console.error("❌ Error fetching product:", err);

        if (err.response?.status === 404) {
          // Fetch available IDs
          const ids = await productService.getAvailableProductIds();
          setAvailableIds(ids);

          setError(
            `Product with ID ${id} does not exist in your Strapi database.`
          );
        } else {
          setError(
            "Failed to load product. Please check your connection to Strapi."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Parse price from string to number
  const parsePrice = (priceString: string): number => {
    if (!priceString) return 0;

    // Handle different price formats: "$ 19.00 USD", "19.00", "$19", etc.
    const priceMatch = priceString.match(/(\d+(\.\d+)?)/);
    if (priceMatch) {
      return parseFloat(priceMatch[1]);
    }

    // Try direct parsing as fallback
    const cleaned = priceString.replace(/[^0-9.]/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Add to cart function
  const handleAddToCart = () => {
    if (!product) return;

    // Validate selections based on available options
    const requiresColor = product.colors && product.colors.length > 0;
    const requiresSize = product.sizes && product.sizes.length > 0;

    if (requiresColor && !selectedColor) {
      alert("Please select a color");
      return;
    }

    if (requiresSize && !selectedSize) {
      alert("Please select a size");
      return;
    }

    setAddingToCart(true);

    // Parse the price
    const price = parsePrice(product.price);

    // Prepare cart item matching your CartItem interface
    const cartItem = {
      id: product.id,
      name: product.name,
      price: price,
      image: product.image || fallbackImage,
      size: selectedSize || "One Size", // Default if no sizes
      color: selectedColor || "Default", // Default if no colors
      quantity: quantity,
    };

    console.log("🛒 Adding to cart:", cartItem);

    // Check if user is authenticated
    if (!isAuthenticated) {
      // User is not logged in - add to pending cart
      dispatch(addToPending(cartItem));

      // Show login modal
      setShowLoginModal(true);
      console.log(
        "🔄 User not authenticated, added to pending cart and showing login modal"
      );

      // Show message about pending cart
      alert(
        `✅ ${product.name} added to cart! Please login to complete your purchase.`
      );
    } else {
      // User is authenticated - add directly to cart
      dispatch(addToCart(cartItem));

      // Show success message
      alert(`✅ ${product.name} added to cart!`);

      // Optional: You could navigate to cart page
      // navigate("/cart");
    }

    setAddingToCart(false);
  };

  // Handle login success
  const handleLoginSuccess = () => {
    // When user logs in, the setUserCart action will merge pending items
    setShowLoginModal(false);

    // Optional: Show confirmation
    if (product) {
      alert(`Welcome back! Your cart items have been restored.`);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) setQuantity(value);
  };

  // Increment quantity
  const incrementQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  // Decrement quantity
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // Check if options are required
  const getCanAddToCart = () => {
    if (!product) return false;

    const requiresColor = product.colors && product.colors.length > 0;
    const requiresSize = product.sizes && product.sizes.length > 0;

    return (!requiresColor || selectedColor) && (!requiresSize || selectedSize);
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04322f] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg mb-4">
            {error || "Product not found"}
          </p>

          {availableIds.length > 0 && (
            <div className="max-w-2xl mx-auto mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-3">
                Available Product IDs:
              </h3>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {availableIds.map((availableId) => (
                  <button
                    key={availableId}
                    onClick={() => navigate(`/product/${availableId}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Product #{availableId}
                  </button>
                ))}
              </div>
              <p className="text-sm text-blue-600">
                Click on any product ID above to view that product
              </p>
            </div>
          )}

          <button
            onClick={() => navigate("/shop")}
            className="mt-4 px-6 py-3 bg-[#04322f] text-white rounded-full font-medium hover:bg-[#03201e] transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const requiresColor = product.colors && product.colors.length > 0;
  const requiresSize = product.sizes && product.sizes.length > 0;
  const canAddToCart = getCanAddToCart();
  const parsedPrice = parsePrice(product.price);

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 flex flex-col gap-6 md:gap-8 lg:gap-10">
      {/* Back Button */}
      <button
        onClick={() => navigate("/shop")}
        className="flex items-center gap-2 text-[#04322f] hover:text-[#b94e31] transition-colors w-fit"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Shop</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-10 justify-between items-start">
        {/* Product Image */}
        <div className="w-full">
          <div
            className="rounded-3xl lg:rounded-4xl overflow-hidden bg-gray-100"
            onClick={() => setShowImageModal(true)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={product.image || fallbackImage}
              alt={product.name}
              className="w-full h-auto max-h-[400px] sm:max-h-[500px] lg:max-h-[585px] object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
            />
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold text-[#04322f]">
                  {product.price}
                </p>
                <p className="text-sm text-gray-600">
                  {parsedPrice > 0
                    ? `($${parsedPrice.toFixed(2)} each)`
                    : "Price not available"}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                <p>Free shipping over $50</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full">
          <div id="heads" className="mb-4 md:mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-[50px] font-semibold text-[#04322f]">
              {product.name}
            </h1>
            <p className="text-gray-600 mt-2">
              Category: {product.category} | Gender: {product.gender}
            </p>
          </div>

          <div className="info_detail_ship mb-6 md:mb-8">
            <ProductTabs />
          </div>

          {/* Color and Size Selection */}
          {(requiresColor || requiresSize) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start justify-between mb-6 md:mb-7">
              {/* Color Selection */}
              {requiresColor && (
                <div id="color" className="flex flex-col gap-3">
                  <div className="flex items-center gap-4 md:gap-6">
                    <h2 className="font-medium text-base sm:text-lg md:text-[18px]">
                      Color
                    </h2>
                    <h3 className="text-base sm:text-lg md:text-[18px] text-gray-700">
                      {selectedColor || "Select color"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {product.colors!.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          selectedColor === color
                            ? "border-gray-800 ring-2 ring-offset-2 ring-gray-800 scale-110"
                            : "border-gray-300 hover:border-gray-500 hover:scale-105"
                        }`}
                        style={{
                          backgroundColor: color.toLowerCase(),
                          borderColor:
                            color === "White" ? "#d1d5db" : undefined,
                        }}
                        aria-label={`Select ${color} color`}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {requiresSize && (
                <div id="size" className="flex flex-col gap-3">
                  <div className="flex items-center gap-4 md:gap-6">
                    <h2 className="font-medium text-base sm:text-lg md:text-[18px]">
                      Size
                    </h2>
                    <h3 className="text-base sm:text-lg md:text-[18px] text-gray-700">
                      {selectedSize || "Select size"}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    {product.sizes!.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 md:px-5 md:py-3 rounded-full border text-sm font-medium transition-all duration-300 ${
                          selectedSize === size
                            ? "bg-gray-800 text-white border-gray-800"
                            : "border-gray-300 hover:border-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 lg:gap-8 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-auto" id="quantity">
              <h2 className="font-medium text-base sm:text-lg md:text-[18px] mb-2">
                Quantity
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-lg">−</span>
                </button>

                <div className="relative">
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max="10"
                    className="w-20 sm:w-24 text-center outline-none py-3 px-5 border-b-2 border-gray-300 focus:border-gray-600 transition-colors duration-400 bg-transparent"
                  />
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    Max: 10
                  </div>
                </div>

                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= 10}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-lg">+</span>
                </button>
              </div>
            </div>

            <div id="cart_btn" className="w-full sm:w-auto mt-4 sm:mt-0">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || !canAddToCart}
                className={`w-full sm:w-auto text-md md:text-lg text-white font-semibold py-4 px-8 md:px-12 rounded-3xl lg:rounded-4xl transition-all duration-600 transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-3 min-w-[200px] ${
                  canAddToCart && !addingToCart
                    ? "bg-[#b94e31] hover:bg-[#495f11]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {addingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    {canAddToCart ? "Add to Cart" : "Select Options"}
                  </>
                )}
              </button>

              {/* Requirements hint */}
              {(requiresColor || requiresSize) && !canAddToCart && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  {requiresColor && !requiresSize && !selectedColor
                    ? "Please select a color"
                    : !requiresColor && requiresSize && !selectedSize
                    ? "Please select a size"
                    : requiresColor &&
                      requiresSize &&
                      (!selectedColor || !selectedSize)
                    ? "Please select color and size"
                    : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div id="desc" className="w-full mt-6 md:mt-8">
        <h3 className="text-xl font-semibold text-[#04322f] mb-4">
          Description
        </h3>
        <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">
          Discover the perfect addition to your wardrobe with this{" "}
          {product.name}. Crafted with attention to detail and designed for both
          style and comfort, this piece from our {product.category} collection
          is versatile enough for any occasion. Available in multiple sizes and
          colors to suit your personal style.
        </p>
      </div>

      {/* Tags */}
      <div id="tags" className="flex flex-wrap gap-2 items-center mt-4 md:mt-6">
        <span className="py-2 px-3 sm:py-2 sm:px-4 rounded-3xl border text-sm sm:text-base">
          {product.category}
        </span>
        <span className="py-2 px-3 sm:py-2 sm:px-4 rounded-3xl border text-sm sm:text-base">
          {product.gender}
        </span>
        <span className="py-2 px-3 sm:py-2 sm:px-4 rounded-3xl border text-sm sm:text-base bg-green-50 text-green-700 border-green-200">
          In Stock
        </span>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          navigate("/register");
        }}
        onForgotPassword={() => {
          setShowLoginModal(false);
          navigate("/forgot-password");
        }}
        onLoginSuccess={handleLoginSuccess}
      />
      <ImageModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        imageUrl={product.image || fallbackImage}
        productName={product.name}
      />
    </div>
  );
};

export default ProductDetail;
