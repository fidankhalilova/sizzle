import MarqueeBanner from "../Components/Marquee";
import ProductsPage from "../Sections/Shop/ProductsPage";
import ShopHeroBanner from "../Sections/Shop/ShopBanner";

const ShopTemplate = () => {
  return (
    <div>
      <ShopHeroBanner />
      <ProductsPage />
      <div className="mb-20"></div>
      <MarqueeBanner />
    </div>
  );
};

export default ShopTemplate;
