import React, { useState } from "react";

/**
 * Renders an editable form for General Contract Details, styled like the
 * collapsible table in the image.
 * * @param {object} general - The current state object for general contract details.
 * @param {function} setGeneral - The function to update the general state.
 */
export default function GeneralContractForm({ general, setGeneral }) {
  // State to manage the collapse/expand functionality
  const [isOpen, setIsOpen] = useState(true);

  // Function to update a specific field in the general state object
  const updateField = (field, value) => setGeneral({ ...general, [field]: value });

  // Array defining the form fields that will be displayed in the table-like layout
const formFields = [
  {
    label: "Contract Name",
    field: "contractName",
    type: "text",
    placeholder: "e.g., Summer 2028 International DMC"
  },
  {
    label: "Hotel Name",
    field: "hotelName",
    type: "text",
    placeholder: "e.g., Oceanview Retreat"
  },
  { 
    label: "Rate Basis", 
    field: "rateBasis", 
    type: "text", 
    placeholder: "e.g., half board" 
  },
  { 
    label: "Currency", 
    field: "currency", 
    type: "text", 
    placeholder: "e.g., USD" 
  },
  { 
    label: "Inclusivity", 
    field: "inclusivity", 
    type: "textarea", 
    placeholder: "Rates include breakfast, dinner, and all local taxes..." 
  },
  { 
    label: "Online Markup Policy", 
    field: "onlineMarkupPolicy", 
    type: "textarea", 
    placeholder: "Contracted rates must not be published online..." 
  },
  { 
    label: "Peak: Christmas & New Year Start", 
    field: "peakStart", 
    type: "date", 
    placeholder: "" 
  },
  { 
    label: "Peak: Christmas & New Year End", 
    field: "peakEnd", 
    type: "date", 
    placeholder: "" 
  },
  { 
    label: "Government Tax Note", 
    field: "governmentTaxNote", 
    type: "textarea", 
    placeholder: "Any special notes regarding government taxes." 
  },
];


  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
      {/* Header Section (Collapsible Trigger) */}
      <div 
        className="flex justify-between items-center px-4 py-3 bg-gray-50 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: '#F9FAFB', borderBottom: isOpen ? '1px solid #E5E7EB' : 'none' }}
      >
        <h2 className="text-base font-semibold" style={{ color: '#2563EB' }}>
          General Information
        </h2>
        {/* Caret/Arrow Icon */}
        <svg 
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-0' : 'transform rotate-180'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
        </svg>
      </div>

      {/* Content Section (Editable Table) - Conditionally Rendered */}
      {isOpen && (
        <div className="p-0">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {formFields.map((item, index) => (
                <tr key={item.field}>
                  {/* Left Column (Label) */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 w-1/3 sm:w-1/4 align-top pt-5" style={{ minWidth: '150px' }}>
                    {item.label}
                  </td>
                  {/* Right Column (Input/Textarea) */}
                  <td className="px-6 py-3 text-sm text-gray-900 w-2/3 sm:w-3/4">
                    {item.type === "textarea" ? (
                      <textarea
                        className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                        value={general[item.field] || ""}
                        onChange={(e) => updateField(item.field, e.target.value)}
                        placeholder={item.placeholder}
                        rows={2} // Use 2 rows for text areas
                      />
                    ) : (
                      <input
                        type={item.type}
                        className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                        value={general[item.field] || ""}
                        onChange={(e) => updateField(item.field, e.target.value)}
                        placeholder={item.placeholder}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}