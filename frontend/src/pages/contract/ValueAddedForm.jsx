import React, { useEffect } from "react";
import { Gift, User, Bed, Utensils, Heart, PlusCircle, Trash2, Info } from "lucide-react";

export default function ValueAddedForm({ valueAdded, setValueAdded }) {
  // Ensure at least one VAS exists
  useEffect(() => {
    if (!valueAdded || valueAdded.length === 0) {
      setValueAdded([
        {
          serviceName: "",
          applicableStay: "",
          guestType: "",
          requiredMealBasis: "",
          honeymoonCondition: "",
        },
      ]);
    }
  }, [valueAdded, setValueAdded]);

  const updateVAS = (index, field, value) => {
    setValueAdded((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addVAS = () =>
    setValueAdded((prev) => [
      ...prev,
      {
        serviceName: "",
        applicableStay: "",
        guestType: "",
        requiredMealBasis: "",
        honeymoonCondition: "",
      },
    ]);

  const removeVAS = (index) =>
    setValueAdded((prev) => {
      const newVAS = prev.filter((_, i) => i !== index);
      return newVAS.length > 0
        ? newVAS
        : [
            {
              serviceName: "",
              applicableStay: "",
              guestType: "",
              requiredMealBasis: "",
              honeymoonCondition: "",
            },
          ];
    });

  return (
    <div className="bg-white/80 backdrop-blur-lg shadow-xl p-8 rounded-2xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-green-100 text-green-700">
          <Gift className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Value Added Services</h2>
      </div>

      {/* VAS Cards */}
      {valueAdded.map((vas, index) => (
        <div
          key={index}
          className="relative bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all mb-6"
        >
          {/* Delete Button */}
          {valueAdded.length > 1 && (
            <button
              onClick={() => removeVAS(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}

          <div className="grid grid-cols-1 gap-5">
            {/* Service Name */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                Service Name <Gift className="w-4 h-4 text-gray-400" />
              </label>
              <input
                type="text"
                value={vas.serviceName}
                onChange={(e) => updateVAS(index, "serviceName", e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Free Candlelight Dinner"
              />
            </div>

            {/* Applicable Stay */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                Applicable Stay <Bed className="w-4 h-4 text-gray-400" />
              </label>
              <input
                type="text"
                value={vas.applicableStay}
                onChange={(e) => updateVAS(index, "applicableStay", e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Minimum 3 Nights"
              />
            </div>

            {/* Guest Type */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                Guest Type <User className="w-4 h-4 text-gray-400" />
              </label>
              <input
                type="text"
                value={vas.guestType}
                onChange={(e) => updateVAS(index, "guestType", e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Honeymoon Couples / Families"
              />
            </div>

            {/* Required Meal Basis */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                Required Meal Basis <Utensils className="w-4 h-4 text-gray-400" />
              </label>
              <input
                type="text"
                value={vas.requiredMealBasis}
                onChange={(e) => updateVAS(index, "requiredMealBasis", e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Half Board / Full Board"
              />
            </div>

            {/* Honeymoon Condition */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                Honeymoon Condition <Heart className="w-4 h-4 text-gray-400" />
              </label>
              <input
                type="text"
                value={vas.honeymoonCondition}
                onChange={(e) => updateVAS(index, "honeymoonCondition", e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Marriage certificate within 6 months"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        onClick={addVAS}
        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 active:scale-[0.98] transition-all mt-4 shadow-md"
      >
        <PlusCircle className="w-5 h-5" />
        Add Value Added Service
      </button>
    </div>
  );
}
