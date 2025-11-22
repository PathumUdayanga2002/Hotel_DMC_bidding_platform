import React, { useEffect } from "react";
import {
  UtensilsCrossed,
  PlusCircle,
  Trash2,
  Info,
} from "lucide-react";

export default function MealSupplementsForm({ meals, setMeals }) {
  // Ensure at least one meal exists
  useEffect(() => {
    if (!meals || meals.length === 0) {
      setMeals([
        {
          type: "",
          description: "",
          cost: 0,
          costBasis: "per person per night",
          mandatory: false,
          childDiscountPercent: 0,
        },
      ]);
    }
  }, [meals, setMeals]);

  const updateMeal = (index, field, value) => {
    setMeals((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addMeal = () =>
    setMeals((prev) => [
      ...prev,
      {
        type: "",
        description: "",
        cost: 0,
        costBasis: "per person per night",
        mandatory: false,
        childDiscountPercent: 0,
      },
    ]);

  const removeMeal = (index) =>
    setMeals((prev) => {
      const newMeals = prev.filter((_, i) => i !== index);
      return newMeals.length > 0
        ? newMeals
        : [
            {
              type: "",
              description: "",
              cost: 0,
              costBasis: "per person per night",
              mandatory: false,
              childDiscountPercent: 0,
            },
          ];
    });

  return (
    <div className="bg-white/80 backdrop-blur-lg shadow-xl p-8 rounded-2xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-green-100 text-green-700">
          <UtensilsCrossed className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Meal Supplements</h2>
      </div>

      {/* Meal Cards */}
      {meals.map((meal, index) => (
        <div
          key={index}
          className="relative bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all mb-6"
        >
          {/* Delete Icon */}
          {meals.length > 1 && (
            <button
              onClick={() => removeMeal(index)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}

          <div className="grid grid-cols-1 gap-5">

            {/* Meal Type */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Meal Type
              </label>
              <input
                type="text"
                value={meal.type}
                onChange={(e) => updateMeal(index, "type", e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Lunch, Dinner, Full Board..."
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Description
              </label>
              <textarea
                value={meal.description}
                onChange={(e) =>
                  updateMeal(index, "description", e.target.value)
                }
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                rows={2}
                placeholder="Short description (optional)"
              />
            </div>

            {/* Cost + Cost Basis */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Cost ($)
                </label>
                <input
                  type="number"
                  value={meal.cost}
                  onChange={(e) =>
                    updateMeal(index, "cost", Number(e.target.value))
                  }
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="0"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm font-semibold text-gray-700">
                  Cost Basis
                </label>
                <select
                  value={meal.costBasis}
                  onChange={(e) =>
                    updateMeal(index, "costBasis", e.target.value)
                  }
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="per person">Per Person</option>
                  <option value="per adult per day">
                    Per Adult Per Day
                  </option>
                  <option value="per person per night">
                    Per Person Per Night
                  </option>
                  <option value="per child per night">
                    Per Child Per Night
                  </option>
                </select>
              </div>
            </div>

            {/* Mandatory */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={meal.mandatory}
                onChange={(e) =>
                  updateMeal(index, "mandatory", e.target.checked)
                }
                className="h-4 w-4 accent-green-600"
              />
              <span className="text-sm font-medium text-gray-700">
                Mandatory
              </span>
            </div>

            {/* Child Discount */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                Child Discount (%)
                <Info className="w-4 h-4 text-gray-400" />
              </label>
              <input
                type="number"
                value={meal.childDiscountPercent}
                onChange={(e) =>
                  updateMeal(
                    index,
                    "childDiscountPercent",
                    Number(e.target.value)
                  )
                }
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                placeholder="e.g. 50"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add Button */}
      <button
        onClick={addMeal}
        className="
          w-full flex items-center justify-center gap-2 
          bg-green-600 text-white py-3 rounded-xl 
          hover:bg-green-700 active:scale-[0.98] 
          transition-all mt-4 shadow-md
        "
      >
        <PlusCircle className="w-5 h-5" />
        Add Meal Supplement
      </button>
    </div>
  );
}
