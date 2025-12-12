// components/FAQAccordion.tsx
import React, { useState } from "react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQAccordion: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "Are your products ethically sourced and produced?",
      answer:
        "Yes, we are committed to ethical sourcing and production. All our products come from suppliers who adhere to fair labor practices and sustainable sourcing methods. We conduct regular audits to ensure compliance with our ethical standards.",
    },
    {
      id: 2,
      question: "How do you ensure the quality of your products?",
      answer:
        "We have a rigorous quality control process that includes multiple checkpoints. Each product undergoes thorough inspection before shipping, and we work closely with our manufacturers to maintain consistent quality standards.",
    },
    {
      id: 3,
      question:
        "Do you offer gift wrapping or personalized messages for orders?",
      answer:
        "Yes! We offer complimentary gift wrapping and the option to include a personalized message. You can select these options during checkout in the 'Special Instructions' section.",
    },
    {
      id: 4,
      question:
        "Are the colors of the products accurate in the website images?",
      answer:
        "We strive to display colors as accurately as possible. However, due to screen settings and lighting conditions, there may be slight variations. For color-critical items, we recommend checking multiple images or contacting our support team.",
    },
    {
      id: 5,
      question: "How do I determine the right size for clothing?",
      answer:
        "We provide detailed size charts for each clothing item. You can find measurements and fit guides on each product page. If you need further assistance, our customer service team can help you choose the perfect fit.",
    },
    {
      id: 6,
      question: "How do I care for and wash the clothing items?",
      answer:
        "Care instructions are provided on the label of each garment. Generally, we recommend washing similar colors together in cold water and air drying or tumble drying on low heat to maintain fabric quality.",
    },
    {
      id: 7,
      question:
        "Do you offer any guarantees or warranties on the quality of your products?",
      answer:
        "Yes, we offer a 30-day satisfaction guarantee and a 1-year warranty on manufacturing defects. If you're not satisfied with your purchase, please contact our support team for assistance.",
    },
    {
      id: 8,
      question: "Can I cancel or modify my order after it has been placed?",
      answer:
        "You can modify or cancel your order within 1 hour of placing it, provided it hasn't been shipped yet. Visit your order history or contact our support team immediately for assistance.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        The Most Common Questions
      </h1>

      <div className="space-y-4">
        {faqData.map((faq) => (
          <div
            key={faq.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden transition-all duration-300"
          >
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#04322f] focus:ring-opacity-50"
              onClick={() => toggleFAQ(faq.id)}
              aria-expanded={activeIndex === faq.id}
            >
              <span className="text-lg font-semibold text-gray-800 pr-4">
                {faq.question}
              </span>
              <span className="shrink-0 ml-2">
                <svg
                  className={`w-6 h-6 text-gray-600 transform transition-transform duration-300 ${
                    activeIndex === faq.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>

            <div
              className={`px-6 overflow-hidden transition-all duration-300 ${
                activeIndex === faq.id
                  ? "max-h-96 pb-4 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="pt-2 pb-4">
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQAccordion;
