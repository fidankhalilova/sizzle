import { useState } from "react";

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState("info");

  const tabs = [
    { id: "info", label: "Info" },
    { id: "details", label: "Details" },
    { id: "shipping", label: "Shipping" },
  ];

  const content = {
    info: "Get ready to elevate your denim game with our stylish and versatile high waisted jeans. These jeans are designed to flatter your figure and provide a comfortable fit that accentuates your curves. The high-rise waistline not only elongates your legs but also offers a sleek and slimming effect.",
    details:
      "Made from premium stretch denim with 98% cotton and 2% elastane for comfort and durability. Features classic five-pocket styling, zip fly with button closure, and reinforced belt loops. Available in multiple washes and sizes.",
    shipping:
      "Free standard shipping on orders over $50. Standard delivery takes 5-7 business days. Express shipping available for $15 with 2-3 day delivery. International shipping available to select countries. Returns accepted within 30 days of purchase.",
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex gap-8 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-lg font-medium transition-colors duration-400 relative ${
              activeTab === tab.id
                ? "text-[#b94e31]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#b94e31] duration-400" />
            )}
          </button>
        ))}
      </div>

      <div className="text-gray-700 leading-relaxed">
        {content[activeTab as keyof typeof content]}
      </div>
    </div>
  );
}
