import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#04322f] text-white">
      <div className="container mx-auto px-4 md:px-12 py-16">
        {/* Top section with 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Info Column */}
          <div>
            <h3 className="text-2xl font-bold mb-8 pb-4 border-b border-white/20">
              Info
            </h3>
            <ul className="space-y-4">
              <li className="text-lg hover:text-gray-300 cursor-pointer transition-colors">
                Our Story
              </li>
              <li className="text-lg hover:text-gray-300 cursor-pointer transition-colors">
                FAQ
              </li>
              <li className="text-lg hover:text-gray-300 cursor-pointer transition-colors">
                Our Blog
              </li>
              <li className="text-lg hover:text-gray-300 cursor-pointer transition-colors">
                Gifts
              </li>
            </ul>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-2xl font-bold mb-8 pb-4 border-b border-white/20">
              Shop
            </h3>
            <ul className="space-y-4">
              <li className="text-lg hover:text-gray-300 cursor-pointer transition-colors">
                Party Wear
              </li>
              <li className="text-lg hover:text-gray-300 cursor-pointer transition-colors">
                Office Wear
              </li>
              <li className="text-lg hover:text-gray-300 cursor-pointer transition-colors">
                Wedding
              </li>
              <li className="text-lg hover:text-gray-300 cursor-pointer transition-colors">
                Local designers
              </li>
              <li className="text-lg hover:text-gray-300 cursor-pointer transition-colors">
                Denim collection
              </li>
              <li className="text-lg hover:text-gray-300 cursor-pointer transition-colors">
                On sale
              </li>
              <li className="text-lg hover:text-gray-300 cursor-pointer transition-colors">
                Discuss
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="text-2xl font-bold mb-8 pb-4 border-b border-white/20">
              Help
            </h3>
            <ul className="space-y-4">
              <li className="text-lg hover:text-gray-300 cursor-pointer transition-colors">
                Customer Service
              </li>
              <li className="text-lg hover:text-gray-300 cursor-pointer transition-colors">
                Returns & Exchanges
              </li>
              <li className="text-lg hover:text-gray-300 cursor-pointer transition-colors">
                Shipping Information
              </li>
              <li className="text-lg hover:text-gray-300 cursor-pointer transition-colors">
                Terms of Service
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="text-2xl font-bold mb-8 pb-4 border-b border-white/20">
              Become a member
            </h3>
            <p className="text-lg text-gray-300 mb-6">Your email address</p>

            {/* Email Input */}
            <div className="flex mb-8">
              <input
                type="email"
                placeholder="Enter your email"
                className="grow px-4 py-3 bg-white/10 border border-gray-600 rounded-l-lg focus:outline-none focus:border-[#b94e31] text-white placeholder-gray-400"
              />
              <button className="bg-[#b94e31] hover:bg-[#a84327] px-6 py-3 rounded-r-lg font-medium transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>

            {/* Commerce Section */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-2xl font-bold mb-2">Commerce</p>
              <p className="text-gray-400 mb-1">
                Beast Your Weather with Pro Apps
              </p>
              <p className="text-gray-400 mb-4">Get 200% Off with Cash</p>
              <p className="text-sm text-gray-400">
                © eCommerce. All Rights Reserved. Licensing
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-gray-400 hover:text-white cursor-pointer transition-colors">
                Try Next
              </span>
              <span className="text-gray-400">
                WireNow Templates by 12th apjus. Powered by Webflow
              </span>
            </div>
            <div className="text-gray-400 text-right">
              <p className="mb-1">Main Template</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
