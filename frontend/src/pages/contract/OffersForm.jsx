import React, { useEffect } from "react";
import { Gift, Calendar, Percent, Link, Trash2 } from "lucide-react";

const FormField = ({ label, placeholder, type = "text", value, onChange, icon: Icon }) => (
  <div className="flex flex-col">
    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
      {Icon && <Icon className="w-4 h-4 mr-2 text-gray-500" />}
      {label}
    </label>

    {type === "select" ? (
      <select
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
      >
        <option value={false}>Not Combinable</option>
        <option value={true}>Combinable</option>
      </select>
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
      />
    )}
  </div>
);

export default function OffersForm({ offers, setOffers }) {

  // Auto-load one empty offer on first render
  useEffect(() => {
    if (offers.length === 0) {
      setOffers([
        {
          name: "",
          condition: "",
          discountPercent: 0,
          combinable: false,
          exclusionPeriodName: "",
          relatedPolicy: "",
        },
      ]);
    }
  }, []);

  const updateOffer = (index, field, value) => {
    const updated = [...offers];
    updated[index][field] = value;
    setOffers(updated);
  };

  const addOffer = () =>
    setOffers([
      ...offers,
      {
        name: "",
        condition: "",
        discountPercent: 0,
        combinable: false,
        exclusionPeriodName: "",
        relatedPolicy: "",
      },
    ]);

  const deleteOffer = (index) => {
    const updated = offers.filter((_, i) => i !== index);

    // If deleting last remaining → keep one empty
    if (updated.length === 0) {
      setOffers([
        {
          name: "",
          condition: "",
          discountPercent: 0,
          combinable: false,
          exclusionPeriodName: "",
          relatedPolicy: "",
        },
      ]);
    } else {
      setOffers(updated);
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-xl space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Gift className="w-6 h-6 text-green-500" /> Offers & Packages
      </h2>

      <div className="space-y-4">
        {offers.map((offer, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-4 shadow-sm space-y-3 relative">

            {/* DELETE BUTTON */}
            <button
              onClick={() => deleteOffer(i)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Delete Offer"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <FormField
              label="Offer Name"
              placeholder="Mid-Season Special"
              value={offer.name}
              onChange={(e) => updateOffer(i, "name", e.target.value)}
              icon={Gift}
            />

            <FormField
              label="Condition / Timeline"
              placeholder="Stay minimum 5 nights"
              value={offer.condition}
              onChange={(e) => updateOffer(i, "condition", e.target.value)}
              icon={Calendar}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                label="Discount %"
                type="number"
                placeholder="10"
                value={offer.discountPercent}
                onChange={(e) => updateOffer(i, "discountPercent", e.target.value)}
                icon={Percent}
              />

              <FormField
                label="Combinable"
                type="select"
                value={offer.combinable}
                onChange={(e) => updateOffer(i, "combinable", e.target.value === "true")}
              />
            </div>

            <FormField
              label="Exclusion Period"
              placeholder="Christmas & New Year"
              value={offer.exclusionPeriodName}
              onChange={(e) => updateOffer(i, "exclusionPeriodName", e.target.value)}
              icon={Calendar}
            />

            <FormField
              label="Related Policy"
              placeholder="Can be combined with early bird offers only"
              value={offer.relatedPolicy}
              onChange={(e) => updateOffer(i, "relatedPolicy", e.target.value)}
              icon={Link}
            />

          </div>
        ))}
      </div>

      <button
        onClick={addOffer}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
      >
        Add Offer
      </button>
    </div>
  );
}
