import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  Search,
  UserRound,
  Menu,
  X,
  ChevronRight,
  LogOut,
  User,
  Package,
  Heart,
  Settings,
} from "lucide-react";
import { navbarItems } from "../../Constants/navbarItems";
import { useAppDispatch, useAppSelector } from "../../Store/hooks";
import { logoutUser, checkAuth } from "../../Store/Slices/authSlice";
import { supabase } from "../../Lib/supabase";
import LoginModal from "../../Features/Components/LoginModal";
import RegisterModal from "../../Features/Components/RegisterModal";
import CartModal from "../../Features/Components/CartModal";

const Header: React.FC = () => {
  // State management
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [registerOpen, setRegisterOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Redux hooks
  const dispatch = useAppDispatch();
  const {
    isAuthenticated,
    user,
    isLoading: authLoading,
  } = useAppSelector((state) => state.auth);
  const { totalItems, totalPrice } = useAppSelector((state) => state.cart);

  // Helper function to get display name
  const getUserDisplayName = (): string => {
    if (!user) return "Welcome";
    return user.name || user.email?.split("@")[0] || "User";
  };

  // Check auth on mount and when user changes
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session && !isAuthenticated) {
          await dispatch(checkAuth()).unwrap();
        }
      } catch (error) {
        console.error("Auth init error:", error);
      }
    };

    initializeAuth();
  }, [dispatch, isAuthenticated]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Body scroll lock for modals
  useEffect(() => {
    const shouldLock =
      mobileMenuOpen || cartOpen || loginOpen || registerOpen || searchOpen;

    if (shouldLock) {
      document.body.style.overflow = "hidden";
      setUserDropdownOpen(false);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen, cartOpen, loginOpen, registerOpen, searchOpen]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const userDropdown = document.getElementById("user-dropdown");
      const userIcon = document.getElementById("user-icon");

      if (
        userDropdown &&
        !userDropdown.contains(target) &&
        userIcon &&
        !userIcon.contains(target)
      ) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [searchOpen]);

  // Add these useEffects to Header.tsx:
  useEffect(() => {
    // Check auth whenever component mounts or route changes
    const checkAuthOnMount = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session && !isAuthenticated) {
          console.log(
            "🔁 Header: Session exists but Redux says not authenticated. Dispatching checkAuth..."
          );
          await dispatch(checkAuth()).unwrap();
        }
      } catch (error) {
        console.error("Header auth check error:", error);
      }
    };

    checkAuthOnMount();
  }, [dispatch, isAuthenticated]);

  // Listen for storage changes (multi-tab support)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "sb-auth-token") {
        console.log("📦 Storage changed, checking auth...");
        dispatch(checkAuth());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch]);

  // Check auth on route change
  useEffect(() => {
    const checkAuthOnRouteChange = () => {
      dispatch(checkAuth());
    };

    // Check auth when URL changes
    window.addEventListener("popstate", checkAuthOnRouteChange);

    return () => {
      window.removeEventListener("popstate", checkAuthOnRouteChange);
    };
  }, [dispatch]);

  // Event handlers
  const handleLogout = (): void => {
    dispatch(logoutUser());
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleUserClick = (): void => {
    // ALWAYS open dropdown - user can decide to login or see account
    setUserDropdownOpen(!userDropdownOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLoginClick = (): void => {
    setLoginOpen(true);
    setUserDropdownOpen(false);
  };

  const handleRegisterClick = (): void => {
    setRegisterOpen(true);
    setUserDropdownOpen(false);
  };

  const handleForgotPassword = (): void => {
    setLoginOpen(false);
    console.log("Forgot password clicked");
  };

  // Add these debug buttons somewhere in your UI (temporary)
  <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 bg-white p-4 rounded-lg shadow-lg border">
    <h3 className="text-sm font-bold mb-2">Cart Debug</h3>
    <button
      onClick={() => {
        const cartData = localStorage.getItem("sizzle_cart");
        console.log("📦 LocalStorage cart:", cartData);
        if (cartData) {
          const parsed = JSON.parse(cartData);
          console.log("📦 Parsed cart:", parsed);
          alert(
            `${parsed.length} items in localStorage:\n${parsed
              .map((item: any) => `• ${item.name} (${item.quantity}x)`)
              .join("\n")}`
          );
        } else {
          alert("No cart data in localStorage");
        }
      }}
      className="px-3 py-2 bg-blue-500 text-white rounded text-xs"
    >
      Check localStorage
    </button>
    <button
      onClick={() => {
        // Manually add a test item
        const testItem = {
          id: 999,
          name: "Test Product",
          price: 29.99,
          image: "https://via.placeholder.com/150",
          size: "M",
          color: "Black",
          quantity: 1,
        };

        const currentCart = localStorage.getItem("sizzle_cart");
        const items = currentCart ? JSON.parse(currentCart) : [];
        items.push(testItem);
        localStorage.setItem("sizzle_cart", JSON.stringify(items));

        console.log("➕ Manually added test item");
        alert("Test item added to localStorage");
      }}
      className="px-3 py-2 bg-green-500 text-white rounded text-xs"
    >
      Add Test Item
    </button>
    <button
      onClick={() => {
        localStorage.removeItem("sizzle_cart");
        console.log("🗑️ Cleared localStorage cart");
        alert("LocalStorage cart cleared");
        window.location.reload();
      }}
      className="px-3 py-2 bg-red-500 text-white rounded text-xs"
    >
      Clear localStorage
    </button>
  </div>;

  return (
    <>
      {/* Header Container */}
      <header
        className={`mx-auto flex justify-center py-4 fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "shadow-[0px_6px_10px_3px_rgba(0,0,0,0.1)] bg-white"
            : "bg-transparent"
        }`}
      >
        {/* Desktop Navigation */}
        <div
          className={`container hidden md:flex items-center justify-between gap-8 px-4 lg:px-12`}
        >
          {/* Logo */}
          <div className="w-30">
            <a href="/" className="flex items-center">
              <h1
                className={`text-4xl lg:text-[40px] font-bold ${
                  scrolled ? "text-[#04322f]" : "text-white"
                } transition-colors duration-300`}
              >
                <span className="text-[#b94e31]">S</span>izzle
              </h1>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center justify-center">
              <ul className="flex flex-row justify-center gap-6 lg:gap-10 items-center text-base lg:text-[18px] font-semibold tracking-wide">
                {navbarItems.map((item) => (
                  <li
                    className="relative group py-3 duration-200"
                    key={item.id}
                  >
                    <a
                      href={item.link}
                      className={`flex gap-2 ${
                        scrolled
                          ? "text-gray-700 hover:text-gray-900"
                          : "text-white hover:text-gray-200"
                      } transition-colors duration-200 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-[#b94e31] after:transition-all after:duration-300 hover:after:w-full`}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="relative flex gap-6 lg:gap-8 items-center">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className={`p-1.5 rounded-full transition-colors ${
                scrolled
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  : "text-white hover:text-gray-200 hover:bg-white/10"
              }`}
              aria-label="Search"
            >
              <Search className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-1.5 group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag
                className={`w-6 h-6 lg:w-8 lg:h-8 transition-colors ${
                  scrolled
                    ? "text-gray-600 group-hover:text-gray-900"
                    : "text-white group-hover:text-gray-200"
                }`}
              />
              {totalItems > 0 && (
                <div className="absolute -top-1 -right-1 bg-[#b94e31] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </div>
              )}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-transparent group-hover:text-gray-500 transition-colors whitespace-nowrap">
                ${totalPrice.toFixed(2)}
              </div>
            </button>

            {/* User Button with Dropdown - ALWAYS ACTIVE */}
            <div className="relative">
              <button
                id="user-icon"
                onClick={handleUserClick}
                className={`p-1.5 rounded-full transition-colors relative ${
                  scrolled
                    ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    : "text-white hover:text-gray-200 hover:bg-white/10"
                } ${authLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                aria-label="Account menu"
                disabled={authLoading}
              >
                <UserRound className="w-5 h-5 lg:w-6 lg:h-6" />
                {/* Green dot when authenticated */}
                {isAuthenticated && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </button>

              {/* User Dropdown Menu - ALWAYS SHOWS OPTIONS */}
              {userDropdownOpen && (
                <div
                  id="user-dropdown"
                  className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl py-3 z-50 border border-gray-200"
                >
                  {isAuthenticated ? (
                    <>
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {user?.email}
                        </p>
                        <div className="text-xs text-green-600 mt-1">
                          ✓ Signed in
                        </div>
                      </div>

                      {/* Dropdown Items */}
                      <div className="py-2">
                        <a
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>My Profile</span>
                        </a>

                        <a
                          href="/orders"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Package className="w-4 h-4" />
                          <span>My Orders</span>
                        </a>

                        <a
                          href="/wishlist"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Heart className="w-4 h-4" />
                          <span>Wishlist</span>
                        </a>

                        <a
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </a>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Login/Register Section - Always shown when not authenticated */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          Welcome to Sizzle
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Sign in to access your account
                        </p>
                      </div>

                      <div className="py-2">
                        <button
                          onClick={handleLoginClick}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Sign In</span>
                        </button>

                        <button
                          onClick={handleRegisterClick}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors mt-1"
                        >
                          <User className="w-4 h-4" />
                          <span>Create Account</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="container flex md:hidden items-center justify-between px-4">
          {/* Mobile Logo */}
          <div className="w-30">
            <a href="/">
              <h1
                className={`text-3xl font-bold ${
                  scrolled ? "text-[#04322f]" : "text-white"
                } transition-colors duration-300`}
              >
                <span className="text-[#b94e31]">S</span>izzle
              </h1>
            </a>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className={`p-2 ${scrolled ? "text-[#04322f]" : "text-white"}`}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2"
              aria-label="Shopping Cart"
            >
              <ShoppingBag
                className={`w-5 h-5 ${
                  scrolled ? "text-[#04322f]" : "text-white"
                }`}
              />
              {totalItems > 0 && (
                <div className="absolute -top-1 -right-1 bg-[#b94e31] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </div>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 ${scrolled ? "text-[#04322f]" : "text-white"}`}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Mobile Menu Panel */}
          <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white">
            <div className="p-6 h-full flex flex-col">
              {/* Mobile Menu Header */}
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-[#04322f]">
                  <span className="text-[#b94e31]">S</span>izzle
                </h1>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#04322f] hover:bg-gray-100 rounded-full"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="mb-8 flex-1">
                <ul className="space-y-1">
                  {navbarItems.map((item) => (
                    <li key={item.id}>
                      <a
                        href={item.link}
                        className="flex items-center justify-between py-4 px-2 text-lg font-semibold text-[#04322f] hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{item.name}</span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Mobile User Section */}
              <div className="border-t border-gray-200 pt-6">
                {isAuthenticated ? (
                  <>
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                      <p className="font-semibold text-[#04322f] mb-1 truncate">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <div className="space-y-2 mb-6">
                      <a
                        href="/profile"
                        className="flex items-center gap-3 py-3 px-4 text-[#04322f] hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <span>My Profile</span>
                      </a>

                      <a
                        href="/orders"
                        className="flex items-center gap-3 py-3 px-4 text-[#04322f] hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Package className="w-5 h-5" />
                        <span>My Orders</span>
                      </a>

                      <a
                        href="/wishlist"
                        className="flex items-center gap-3 py-3 px-4 text-[#04322f] hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Heart className="w-5 h-5" />
                        <span>Wishlist</span>
                      </a>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-3 py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-4 mb-6">
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setLoginOpen(true);
                        }}
                        className="w-full py-3 bg-[#04322f] text-white rounded-full font-medium hover:bg-[#03201e] transition-colors"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setRegisterOpen(true);
                        }}
                        className="w-full py-3 border border-[#04322f] text-[#04322f] rounded-full font-medium hover:bg-[#04322f] hover:text-white transition-colors"
                      >
                        Create Account
                      </button>
                    </div>

                    {/* Mobile Newsletter */}
                    <div className="bg-linear-to-r from-[#495f11] to-[#04322f] rounded-xl p-4">
                      <h3 className="text-white font-semibold mb-2">
                        Stay Updated
                      </h3>
                      <p className="text-white/80 text-sm mb-3">
                        Get exclusive offers and style tips
                      </p>
                      <div className="flex">
                        <input
                          type="email"
                          placeholder="Your email"
                          className="flex-1 px-3 py-2 rounded-l-lg text-sm text-white bg-white/10 border border-white/30 focus:outline-none focus:border-white placeholder:text-white/70"
                        />
                        <button className="bg-[#b94e31] text-white px-4 py-2 rounded-r-lg text-sm font-medium hover:bg-[#a84327] transition-colors">
                          Join
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-120">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSearchOpen(false)}
          />

          {/* Search Panel */}
          <div className="absolute top-0 left-0 right-0 bg-white p-4 shadow-lg">
            <div className="container mx-auto">
              <div className="flex items-center gap-4">
                <Search className="w-6 h-6 text-gray-400" />
                <form onSubmit={handleSearchSubmit} className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products, brands, categories..."
                    className="w-full py-4 text-lg border-0 focus:outline-none focus:ring-0"
                    autoFocus
                  />
                </form>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  aria-label="Close search"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
        onForgotPassword={handleForgotPassword}
      />
      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
    </>
  );
};

export default Header;
