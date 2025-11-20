import React from "react";

export default function TermsConditionsForm({ terms, setTerms }) {
  const updateTerm = (index, field, value) => {
    const updated = [...terms];
    updated[index][field] = value;
    setTerms(updated);
  };

  const addTerm = () => setTerms([...terms, { type: "", applicablePeriod: "", conditionDays: 0, policyDetail: "" }]);

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">⚖️ Terms & Conditions</h2>
      {terms.map((term, i) => (
        <div key={i} className="border rounded p-4 mb-4">
          <input type="text" placeholder="T&C Type" value={term.type} onChange={(e) => updateTerm(i, "type", e.target.value)} className="border rounded p-2 mb-2 w-full" />
          <input type="text" placeholder="Applicable Period" value={term.applicablePeriod} onChange={(e) => updateTerm(i, "applicablePeriod", e.target.value)} className="border rounded p-2 mb-2 w-full" />
          <input type="number" placeholder="Condition (Days)" value={term.conditionDays} onChange={(e) => updateTerm(i, "conditionDays", e.target.value)} className="border rounded p-2 mb-2 w-full" />
          <textarea placeholder="Policy Detail" value={term.policyDetail} onChange={(e) => updateTerm(i, "policyDetail", e.target.value)} className="border rounded p-2 mb-2 w-full" />
        </div>
      ))}
      <button onClick={addTerm} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Add Term
      </button>
    </div>
  );
}
