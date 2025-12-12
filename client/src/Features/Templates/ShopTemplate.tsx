import MarqueeBanner from "../Components/Marquee";
import ProductsPage from "../Sections/Shop/ProductsAndFiltering";
import ShopHeroBanner from "../Sections/Shop/ShopBanner";

const ShopTemplate = () => {
  return (
    <div>
      <ShopHeroBanner />
      <ProductsPage />
      <MarqueeBanner />
    </div>
  );
};

export default ShopTemplate;
