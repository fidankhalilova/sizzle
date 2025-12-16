import ProductDetail from "../Sections/ShopDetail/ProductDetail";
import OtherProducts from "../Sections/ShopDetail/OtherProducts";
import ShopDetailHeroBanner from "../Sections/ShopDetail/ShopDetailBanner";
const ShopDetailTemplate = () => {
  return (
    <div>
      <ShopDetailHeroBanner />
      <div className="my-20">
        <ProductDetail />
        <OtherProducts />
      </div>
    </div>
  );
};

export default ShopDetailTemplate;
