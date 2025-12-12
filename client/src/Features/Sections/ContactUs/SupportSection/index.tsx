import React from "react";

const SupportPage: React.FC = () => {
  return (
    <div className="container mx-auto px-12 py-12 md:py-16">
      {/* Features Grid - All features in one row */}
      <div className="my-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-6">
              <img
                src="https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/645e4fc52c07685fac5c9191_package.svg"
                alt="Returns & exchanges"
                className="w-16 h-16 md:w-20 md:h-20 object-cover"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Returns & exchanges
            </h2>
            <p className="text-gray-600 text-lg">
              We strive to make fashion accessible to everyone, no matter your
              budget.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-6">
              <img
                src="https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/645e4fc48afcb1c31ba34ad6_delivery-truck.svg"
                alt="Fast Shipping"
                className="w-16 h-16 md:w-20 md:h-20 object-cover"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Fast Shipping
            </h2>
            <p className="text-gray-600 text-lg">
              We strive to make fashion accessible to everyone, no matter your
              budget.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-6">
              <img
                src="https://cdn.prod.website-files.com/645a69e5ff9a553155774bec/645e4fc4e8f6f6f8d668931d_24-hours-support.svg"
                alt="Support 24/7"
                className="w-16 h-16 md:w-20 md:h-20 object-cover"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Support 24/7
            </h2>
            <p className="text-gray-600 text-lg">
              We strive to make fashion accessible to everyone, no matter your
              budget.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mb-10 mt-40">
        <div className="w-full mx-auto flex justify-between items-center gap-18">
          <div className="w-1/2">
            {/* Contact Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Get in touch with our support team
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-lg mb-10">
              With our versatile product range and commitment to affordability,
              we are here to help you go places in style, without any
              compromises. So why not browse our collections today and let us
              help you achieve your fashion goals with ease!
            </p>
          </div>

          {/* Divider */}
          <div className="border-r border-gray-300 my-12"></div>

          {/* Contact Form */}
          <form className="space-y-10 w-1/2">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
                Your name
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-transparent border-0 border-b-2 border-dashed border-gray-300 px-0 py-4 focus:outline-none focus:border-gray-500 text-lg"
                  placeholder=""
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
                Your email
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full bg-transparent border-0 border-b-2 border-dashed border-gray-300 px-0 py-4 focus:outline-none focus:border-gray-500 text-lg"
                  placeholder=""
                />
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 uppercase tracking-wide">
                Your text
              </label>
              <div className="relative">
                <textarea
                  rows={4}
                  className="w-full bg-transparent border-0 border-b-2 border-dashed border-gray-300 px-0 py-4 focus:outline-none focus:border-gray-500 text-lg resize-none"
                  placeholder=""
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-10">
              <button
                type="submit"
                className="px-10 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors text-lg"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
