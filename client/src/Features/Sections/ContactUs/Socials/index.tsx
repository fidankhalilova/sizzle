import { ArrowUpRight, MoveRight } from "lucide-react";

const Socials = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-12">
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
  );
};

export default Socials;
