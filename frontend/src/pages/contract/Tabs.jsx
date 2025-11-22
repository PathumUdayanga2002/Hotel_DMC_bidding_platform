import React from "react";

export default function Tabs({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="mb-6">
      {/* Tab buttons */}
      <div className="flex border-b border-gray-300 mb-4 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 -mb-px border-b-2 font-medium whitespace-nowrap ${
              activeTab === index
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active tab content */}
      <div>{tabs[activeTab]?.content}</div>
    </div>
  );
}
