import React from 'react';

const StatButton = ({ label, count, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 w-full"
    >
      <div className="text-lg font-semibold text-gray-800">{label}</div>
      <div className="text-3xl font-bold text-blue-600 mt-2">{count}</div>
    </button>
  );
};

export default StatButton;