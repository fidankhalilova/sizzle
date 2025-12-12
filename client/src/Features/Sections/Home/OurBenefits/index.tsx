import { ArrowUpRight, MoveRight } from "lucide-react";

const OurBenefits = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-12">
      <div className="mt-10 md:mt-16 lg:mt-20 flex flex-col gap-10 md:gap-20 lg:gap-40">
        {/* Why Us Section */}
        <div
          id="whyUs"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12"
        >
          <div
            id="whyUsCard"
            className="flex flex-col md:flex-row gap-4 md:gap-3 items-center justify-center p-4 md:p-0"
          >
            <div className="p-3 md:p-4 rounded-full bg-[#495f11]">
              <img
                src="https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/645e4fc52c07685fac5c9191_package.svg"
                alt="Returns & exchanges"
                className="w-8 md:w-10 fill-white"
              />
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center md:text-left">
              Returns & exchanges
            </h2>
          </div>
          <div
            id="whyUsCard"
            className="flex flex-col md:flex-row gap-4 md:gap-3 items-center justify-center p-4 md:p-0"
          >
            <div className="p-3 md:p-4 rounded-full bg-[#495f11]">
              <img
                src="https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/645e4fc48afcb1c31ba34ad6_delivery-truck.svg"
                alt="Fast Shipping"
                className="w-8 md:w-10 fill-white"
              />
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center md:text-left">
              Fast Shipping
            </h2>
          </div>
          <div
            id="whyUsCard"
            className="flex flex-col md:flex-row gap-4 md:gap-3 items-center justify-center p-4 md:p-0"
          >
            <div className="p-3 md:p-4 rounded-full bg-[#495f11]">
              <img
                src="https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/645e4fc4e8f6f6f8d668931d_24-hours-support.svg"
                alt="Support 24/7"
                className="w-8 md:w-10 fill-white"
              />
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center md:text-left">
              Support 24/7
            </h2>
          </div>
        </div>

        {/* Newsletter Section */}
        <div
          id="news"
          className="border-2 border-[#04322f] rounded-3xl md:rounded-4xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="overflow-hidden">
              <img
                src="https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/645df76b825a96ec23ff6bc0_banner-h1-2-p-1080.webp"
                alt="Sign up discount"
                className="w-full h-48 md:h-64 lg:h-100 object-cover"
              />
            </div>
            <div className="flex justify-center items-center flex-col gap-4 md:gap-5 p-6 md:p-8 lg:p-0">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-center">
                Sign up to get a discount
              </h1>
              <h4 className="text-sm md:text-base lg:text-md text-center max-w-md lg:max-w-lg">
                We strive to make fashion accessible to everyone, no matter your
                budget. We are dedicated to curating a wide range of
                high-quality,
              </h4>
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <input
                  type="text"
                  placeholder="Your email address..."
                  className="outline-none border rounded-3xl md:rounded-4xl py-3 md:py-4 px-4 md:px-6 w-full placeholder:text-gray-400 text-sm md:text-base"
                />
                <button className="bg-[#b94e31] px-6 py-3 md:py-4 rounded-3xl md:rounded-4xl text-white font-medium whitespace-nowrap text-sm md:text-base">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Section */}
        <div id="social" className="flex flex-col gap-4 md:gap-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
            <h2 className="text-[#495f11] text-xl md:text-2xl lg:text-3xl">
              @sizzle
            </h2>
            <button className="text-[#495f11] text-lg md:text-xl lg:text-2xl flex gap-2 items-center">
              View More <MoveRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 relative">
            {[
              {
                src: "https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/64710f10c34d2412b6e6d960_brian-wangenheim-CIfJMx4qKRY-unsplash.webp",
                alt: "Social image 1",
              },
              {
                src: "https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/64710f71bb86adbb8a0b22b8_nsey-benajah-eqhkEKsurbo-unsplash-p-500.webp",
                alt: "Social image 2",
              },
              {
                src: "https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/64710f70d88df1dd8739116d_onur-senay-hJOp17MI8k0-unsplash-p-500.webp",
                alt: "Social image 3",
              },
              {
                src: "https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/64710fced5227bcec7ed72bc_tamara-bellis-IwVRO3TLjLc-unsplash-p-500.webp",
                alt: "Social image 4",
              },
            ].map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl md:rounded-3xl lg:rounded-4xl group"
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-40 md:h-48 lg:h-[232px] object-cover group-hover:scale-105 duration-300"
                />
                <div className="p-2 md:p-3 bg-white rounded-full text-black absolute top-2 md:top-3 right-2 md:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurBenefits;
