import { ShoppingBag, Search, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { navbarItems } from "../../Constants/navbarItems";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`mx-auto flex justify-center py-4 fixed top-0 left-0 right-0 bg-transparent w-full z-20 ${
        scrolled
          ? "shadow-[0px_6px_10px_3px_rgba(0,0,0,0.1)] bg-white"
          : "shadow-none"
      }`}
    >
      <div
        id="desktop-nav"
        className={`container md:flex items-center justify-between gap-8 hidden px-12`}
      >
        <div id="logo" className="w-30">
          <h1
            className={`text-[40px] ${
              scrolled ? "text-[#04322f]" : "text-white"
            }`}
          >
            <span className="text-[#b94e31]">S</span>izzle
          </h1>
        </div>
        <div id="navbar">
          <div className=" flex items-center justify-center">
            <ul className="flex flex-row justify-center gap-10 items-center text-[18px] font-semibold tracking-wide">
              {navbarItems &&
                navbarItems.map((item) => (
                  <li
                    className="relative group py-3 hover:text-gray-800 text-gray-400 duration-200"
                    key={item.id}
                  >
                    <a href={item.link} className="flex gap-2">
                      {item.name}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <div id="cart-btn" className=" relative flex gap-8 items-center">
          <Search />
          <div className="relative">
            <ShoppingBag className="relative w-10" />
            <div className="absolute bottom-2 right-0 bg-black p-2 rounded-full text-xs text-white w-5 h-5 flex items-center justify-center">
              0
            </div>
          </div>
          <UserRound />
        </div>
      </div>
    </div>
  );
}
