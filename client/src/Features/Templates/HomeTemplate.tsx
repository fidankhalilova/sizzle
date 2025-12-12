import MarqueeBanner from "../Components/Marquee";
import Categories from "../Sections/Home/Categories";
import ClothCategories from "../Sections/Home/ClothCategories";
import FeaturedProducts from "../Sections/Home/FeaturedProducts";
import HeroBanner from "../Sections/Home/HeroBanner";
import OurBenefits from "../Sections/Home/OurBenefits";

const HomeTemplate = () => {
  return (
    <div className="mb-20">
      <HeroBanner />
      <Categories />
      <FeaturedProducts />
      <MarqueeBanner />
      <ClothCategories />
      <OurBenefits />
    </div>
  );
};

export default HomeTemplate;
