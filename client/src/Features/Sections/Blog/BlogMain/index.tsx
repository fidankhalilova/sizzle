// components/BlogLayout.tsx
import React from "react";
import BlogCard from "../../../Components/BlogCards";
import CategoryCard from "../../../Components/CategoryCard";
import RecentPost from "../../../Components/RecentPost";

const BlogLayout: React.FC = () => {
  // Image URLs - Replace with your own image paths
  const imageUrls = {
    post1:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    post2:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    pattern1:
      "https://cdn.prod.website-files.com/645a69e6ff9a558805774bf2/6477ce08d4c503f66b4360ab_pexels-gustavo-fring-4254146-p-800.jpg",
    pattern2:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    pattern3:
      "https://cdn.prod.website-files.com/645a69e6ff9a558805774bf2/6477ce08d4c503f66b4360ab_pexels-gustavo-fring-4254146-p-800.jpg",
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Left Column - Main Posts */}
        <div className="lg:w-2/3">
          {/* Post 1 */}
          <BlogCard
            category="EFFORTLESS ELEGANCE: THE MINIMALIST FASHION MOVEMENT"
            title="From bold prints to statement accessories, discover how to elevate your style"
            imageUrl={imageUrls.post1}
            altText="Minimalist fashion style"
            readMoreLink="#"
          />

          {/* Post 2 */}
          <BlogCard
            category="10 WARDROBE ESSENTIALS EVERY FASHIONISTA NEEDS"
            title="From bold prints to statement accessories, discover how to elevate your style"
            imageUrl={imageUrls.post2}
            altText="Wardrobe essentials collection"
            readMoreLink="#"
          />

          {/* Two Column Section */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            {/* Left Column - Power Decision */}
            <div>
              <h3 className="font-serif text-2xl md:text-3xl text-gray-900 mb-4 md:mb-6 leading-snug">
                Power decision: demanding
              </h3>
              <div className="mb-6 md:mb-8">
                <div className="w-12 md:w-16 h-px bg-gray-400 mb-3 md:mb-4"></div>
                <p className="text-gray-600 text-sm tracking-wide">
                  The ultimate guide to devotion
                </p>
              </div>

              {/* Pattern block with image */}
              <div className="mt-6 md:mt-10">
                <div className="h-40 md:h-48 bg-gray-50 overflow-hidden">
                  <img
                    src={imageUrls.pattern1}
                    alt="Pattern design"
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Recent Posts */}
            <div>
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-6 md:w-8 h-px bg-black"></div>
                <h4 className="text-xs font-medium tracking-[0.2em] text-gray-800">
                  RECENT POSTS
                </h4>
              </div>

              <div className="space-y-6 md:space-y-8">
                <RecentPost
                  title="Effortless elegance: the minimalist fashion movement"
                  date="May 25, 2022"
                />
                <RecentPost
                  title="Power dressing: channeling confidence through fashion"
                  date="April 1, 2022"
                />
                <RecentPost
                  title="5 fashion trends to try this season"
                  date="April 1, 2022"
                />
                <RecentPost
                  title="10 wardrobe essentials every fashionista needs"
                  date="May 25, 2022"
                  hasBorder={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Categories */}
        <div className="lg:w-1/3 lg:border-l lg:border-gray-200 lg:pl-8 mt-8 lg:mt-0 pt-8 lg:pt-0 border-t lg:border-t-0 border-gray-200">
          <div className="lg:sticky lg:top-8">
            <div className="flex items-center gap-3 mb-8 md:mb-12">
              <div className="w-6 md:w-8 h-px bg-black"></div>
              <h4 className="text-xs font-medium tracking-[0.2em] text-gray-800">
                CATEGORIES
              </h4>
            </div>

            {/* Categories Table */}
            <div className="mb-8 md:mb-12">
              <div className="grid grid-cols-3 border-t border-gray-300">
                <CategoryCard
                  iconLetter="T"
                  title="Tips"
                  className="first:border-l-0"
                />
                <CategoryCard iconLetter="F" title="Fashion" />
                <CategoryCard iconLetter="T" title="Trends" />
              </div>
            </div>

            {/* Visual Pattern with Images */}
            <div className="space-y-4 md:space-y-6">
              {/* Row 1 */}
              <div className="flex gap-3 md:gap-4">
                <div className="w-1/3 h-24 md:h-32 overflow-hidden">
                  <img
                    src={imageUrls.pattern2}
                    alt="Pattern 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-2/3 h-24 md:h-32 overflow-hidden">
                  <img
                    src={imageUrls.pattern3}
                    alt="Pattern 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex gap-3 md:gap-4">
                <div className="w-2/3 h-24 md:h-32 overflow-hidden">
                  <img
                    src={imageUrls.pattern1}
                    alt="Pattern 3"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-1/3 h-24 md:h-32 overflow-hidden">
                  <img
                    src={imageUrls.pattern2}
                    alt="Pattern 4"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex gap-3 md:gap-4">
                <div className="w-1/2 h-24 md:h-32 overflow-hidden">
                  <img
                    src={imageUrls.pattern3}
                    alt="Pattern 5"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-1/2 h-24 md:h-32 overflow-hidden">
                  <img
                    src={imageUrls.pattern1}
                    alt="Pattern 6"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Pattern */}
      <div className="mt-12 md:mt-20 pt-6 md:pt-8 border-t border-gray-300">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="w-12 md:w-16 lg:w-20 h-px bg-gray-900"></div>
            <span className="text-xs text-gray-500 tracking-[0.2em] md:tracking-[0.3em]">
              MINIMALIST DESIGN
            </span>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-6 md:w-8 h-px bg-gray-400"></div>
            <div className="w-12 md:w-16 h-px bg-gray-400"></div>
            <div className="w-6 md:w-8 h-px bg-gray-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogLayout;
