import React from "react";

const CategoriesGrid: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-12 py-12 md:py-20">
      {/* Desktop Grid - hidden on mobile */}
      <div className="hidden md:grid md:grid-cols-4 md:grid-rows-3 gap-4 md:gap-8 min-h-screen">
        {/* Outerwear Card - Box 1 position */}
        <div className="col-span-2 row-span-2 relative rounded-4xl overflow-hidden">
          <img
            src="https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/645d2eba3523924c6fdb0f6b_reynier-carl-87m1_NfKld4-unsplash-p-500.webp"
            alt="Outerwear"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-8 left-8">
            <h3 className="text-4xl lg:text-5xl font-bold text-white">
              Outerwear
            </h3>
          </div>
        </div>

        {/* Swimwear Card - Box 2 position */}
        <div className="col-span-2 row-span-1 relative rounded-4xl overflow-hidden">
          <img
            src="https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/645d2f4fd2e12fdd0cd2652a_daweee.webp"
            alt="Shoes"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
            <h3 className="text-4xl lg:text-5xl font-bold text-white">Shoes</h3>
            <div className="text-white text-lg lg:text-xl font-medium">
              View all
            </div>
          </div>
        </div>

        {/* Dresses Card - Box 3 position */}
        <div className="col-span-2 col-start-3 row-start-1 row-span-1 relative rounded-4xl overflow-hidden">
          <img
            src="https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/645d2e07a232c66610fa898c_image%20865.webp"
            alt="Swimwear"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
            <h3 className="text-4xl lg:text-5xl font-bold text-white">
              Swimwear
            </h3>
            <div className="text-white text-lg lg:text-xl font-medium">
              View all
            </div>
          </div>
        </div>

        {/* Shoes Card - Box 4 position */}
        <div className="col-span-2 col-start-3 row-start-2 row-span-2 relative rounded-4xl overflow-hidden">
          <img
            src="https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/645d2e8da232c66610fb20b2_asddd.webp"
            alt="Dresses"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-8 left-8">
            <h3 className="text-4xl lg:text-5xl font-bold text-white">
              Dresses
            </h3>
          </div>
        </div>
      </div>

      {/* Mobile Stack - shown only on mobile */}
      <div className="flex flex-col gap-6 md:hidden">
        {/* Outerwear Mobile Card */}
        <div className="relative rounded-3xl overflow-hidden aspect-square">
          <img
            src="https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/645d2eba3523924c6fdb0f6b_reynier-carl-87m1_NfKld4-unsplash-p-500.webp"
            alt="Outerwear"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6">
            <h3 className="text-3xl font-bold text-white">Outerwear</h3>
          </div>
        </div>

        {/* Shoes Mobile Card */}
        <div className="relative rounded-3xl overflow-hidden aspect-square">
          <img
            src="https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/645d2f4fd2e12fdd0cd2652a_daweee.webp"
            alt="Shoes"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <h3 className="text-3xl font-bold text-white">Shoes</h3>
            <div className="text-white text-lg font-medium">View all</div>
          </div>
        </div>

        {/* Swimwear Mobile Card */}
        <div className="relative rounded-3xl overflow-hidden aspect-square">
          <img
            src="https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/645d2e07a232c66610fa898c_image%20865.webp"
            alt="Swimwear"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <h3 className="text-3xl font-bold text-white">Swimwear</h3>
            <div className="text-white text-lg font-medium">View all</div>
          </div>
        </div>

        {/* Dresses Mobile Card */}
        <div className="relative rounded-3xl overflow-hidden aspect-square">
          <img
            src="https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/645d2e8da232c66610fb20b2_asddd.webp"
            alt="Dresses"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6">
            <h3 className="text-3xl font-bold text-white">Dresses</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesGrid;
