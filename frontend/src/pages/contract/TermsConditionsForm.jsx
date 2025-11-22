import React, { useEffect } from "react";
import { Trash2, PlusCircle, FileText } from "lucide-react";

export default function TermsConditionsForm({ terms, setTerms }) {

  // Ensure at least one T&C exists on first render
  useEffect(() => {
    if (!terms || terms.length === 0) {
      setTerms([
        {
          type: "",
          applicablePeriod: "",
          conditionDays: 0,
          policyDetail: "",
        },
      ]);
    }
  }, [terms, setTerms]);

  const updateTerm = (index, field, value) => {
    setTerms((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addTerm = () =>
    setTerms((prev) => [
      ...prev,
      {
        type: "",
        applicablePeriod: "",
        conditionDays: 0,
        policyDetail: "",
      },
    ]);

  const removeTerm = (index) =>
    setTerms((prev) => {
      const newList = prev.filter((_, i) => i !== index);

      // Always keep at least ONE empty T&C
      return newList.length > 0
        ? newList
        : [
            {
              type: "",
              applicablePeriod: "",
              conditionDays: 0,
              policyDetail: "",
            },
          ];
    });

  return (
    <div className="bg-white/80 backdrop-blur-lg shadow-xl p-8 rounded-2xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-green-100 text-green-700">
          <FileText className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Terms & Conditions</h2>
      </div>

      {/* Terms Fields */}
      {terms.map((term, index) => (
        <div
          key={index}
          className="relative bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all mb-6"
        >
          {/* Delete button */}
          {terms.length > 1 && (
            <button
              onClick={() => removeTerm(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}

          <div className="grid grid-cols-1 gap-4">
            {/* Type */}
            <div>
              <label className="text-sm font-semibold text-gray-700">T&C Type</label>
              <input
                type="text"
                value={term.type}
                onChange={(e) => updateTerm(index, "type", e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                placeholder="Cancellation / No-Show / Amendment"
              />
            </div>

            {/* Applicable Period */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Applicable Period</label>
              <input
                type="text"
                value={term.applicablePeriod}
                onChange={(e) => updateTerm(index, "applicablePeriod", e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                placeholder="Summer Early & Late Season"
              />
            </div>

            {/* Condition Days */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Condition (Days)</label>
              <input
                type="number"
                value={term.conditionDays}
                onChange={(e) => updateTerm(index, "conditionDays", Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                placeholder="5"
              />
            </div>

            {/* Policy Detail */}
            <div>
              <label className="text-sm font-semibold text-gray-700">Policy Detail</label>
              <textarea
                value={term.policyDetail}
                onChange={(e) => updateTerm(index, "policyDetail", e.target.value)}
                rows={3}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                placeholder="Free cancellation up to 5 days before arrival, afterwards full charge"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        onClick={addTerm}
        className="
          w-full flex items-center justify-center gap-2 
          bg-green-600 text-white py-3 rounded-xl 
          hover:bg-green-700 active:scale-[0.98] 
          transition-all mt-4 shadow-md
        "
      >
        <PlusCircle className="w-5 h-5" />
        Add Term
      </button>
    </div>
  );
}
