import React from "react";

export default function Tabs({ tabs, activeTab, setActiveTab, onSave, beforeNext }) {
  const isFirst = activeTab === 0;
  const isLast = activeTab === tabs.length - 1;

  const goNext = async () => {
    if (isLast) return;
    // call beforeNext hook if provided; if it returns false, cancel navigation
    if (beforeNext) {
      try {
        const result = await beforeNext(activeTab);
        if (result === false) return;
      } catch (e) {
        console.error('beforeNext hook failed:', e);
        return;
      }
    }
    setActiveTab(activeTab + 1);
  };

  const goPrev = () => {
    if (!isFirst) setActiveTab(activeTab - 1);
  };

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
      <div className="mb-4">{tabs[activeTab]?.content}</div>

      {/* Navigation controls: Prev / Next or Save on last tab */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <button
            onClick={goPrev}
            disabled={isFirst}
            className={`px-4 py-2 rounded-md border ${isFirst ? 'text-gray-400 border-gray-200 bg-gray-50' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            Previous
          </button>
        </div>

        <div>
          {!isLast ? (
            <button
              onClick={goNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Save Contract
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
