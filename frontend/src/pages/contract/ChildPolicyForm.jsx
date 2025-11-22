import React from "react";
import { User, Coffee, Bed, DollarSign, Home } from "lucide-react";

const FormField = ({ label, placeholder, type = "text", value, onChange, icon: Icon }) => (
  <div className="flex flex-col">
    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
      {Icon && <Icon className="w-4 h-4 mr-2 text-gray-500" />}
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
    />
  </div>
);

export default function ChildPolicyForm({ childPolicy, setChildPolicy }) {
  const updateField = (field, value) =>
    setChildPolicy({ ...childPolicy, [field]: value });

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <User className="w-6 h-6 text-green-500" /> Child & Extra Bed Policy
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Child  Free of Charge(FOC) Max Age"
          type="number"
          placeholder="Max age for free child stay"
          value={childPolicy.childFOCAgeMax}
          onChange={(e) => updateField("childFOCAgeMax", e.target.value)}
          icon={User}
        />
        <FormField
          label="Child Free of Charge(FOC) Conditions"
          placeholder="Conditions for free child stay"
          value={childPolicy.childFOCConditions}
          onChange={(e) => updateField("childFOCConditions", e.target.value)}
          icon={Coffee}
        />
        <FormField
          label="Child Meal Discount Age Range"
          placeholder="e.g., 3-12 years"
          value={childPolicy.childMealDiscountAgeRange}
          onChange={(e) => updateField("childMealDiscountAgeRange", e.target.value)}
          icon={Coffee}
        />
        <FormField
          label="Child Meal Discount %"
          type="number"
          placeholder="Discount percentage"
          value={childPolicy.childMealDiscountPercent}
          onChange={(e) => updateField("childMealDiscountPercent", e.target.value)}
          icon={DollarSign}
        />
        <FormField
          label="Extra Bed Charge Age"
          placeholder="Age applicable for extra bed"
          value={childPolicy.extraBedChargeAge}
          onChange={(e) => updateField("extraBedChargeAge", e.target.value)}
          icon={Bed}
        />
        <FormField
          label="Extra Bed Cost"
          type="number"
          placeholder="Cost per extra bed"
          value={childPolicy.extraBedCost}
          onChange={(e) => updateField("extraBedCost", e.target.value)}
          icon={DollarSign}
        />
        <FormField
          label="Extra Adult Definition"
          placeholder="How extra adult is defined"
          value={childPolicy.extraAdultDefinition}
          onChange={(e) => updateField("extraAdultDefinition", e.target.value)}
          icon={User}
        />
        <FormField
          label="Extra Adult Rate"
          type="number"
          placeholder="Rate for extra adult"
          value={childPolicy.extraAdultRate}
          onChange={(e) => updateField("extraAdultRate", e.target.value)}
          icon={DollarSign}
        />
        <FormField
          label="Driver Accommodation"
          placeholder="Driver stay details"
          value={childPolicy.driverAccommodation}
          onChange={(e) => updateField("driverAccommodation", e.target.value)}
          icon={Home}
        />
        <FormField
          label="Driver Allowance Amount"
          type="number"
          placeholder="Allowance amount"
          value={childPolicy.driverAllowanceAmount}
          onChange={(e) => updateField("driverAllowanceAmount", e.target.value)}
          icon={DollarSign}
        />
        <FormField
          label="Driver Allowance Currency"
          placeholder="Currency code (e.g., USD)"
          value={childPolicy.driverAllowanceCurrency}
          onChange={(e) => updateField("driverAllowanceCurrency", e.target.value)}
          icon={DollarSign}
        />
      </div>
    </div>
  );
}
