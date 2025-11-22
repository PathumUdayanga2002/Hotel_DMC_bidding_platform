import React, { useEffect, useState } from "react";
import api from "../services/api";
import { ChevronDown } from "lucide-react";

// Modern Minimal Accordion
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-4 bg-gray-50 hover:bg-gray-100 transition font-medium text-gray-800"
      >
        <span>{title}</span>
        <ChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
          size={20}
        />
      </button>

      <div
        className={`transition-all duration-300 ${
          open ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default function MyContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user contracts
  useEffect(() => {
    api
      .get("/hotel/contracts/my")
      .then((res) => setContracts(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-10 bg-gray-100 min-h-screen animate-pulse">
        <h1 className="text-3xl font-semibold mb-6">My Hotel Contracts</h1>
        <p className="text-gray-600">Loading contracts...</p>
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900">
          My Hotel Contracts
        </h1>

        {/* No Contracts */}
        {contracts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center border">
            <h2 className="text-xl font-semibold text-gray-800">No Contracts Yet</h2>
            <p className="text-gray-600 mt-2">
              Create your first contract using the Contract Builder.
            </p>
          </div>
        ) : (
          contracts.map((contract) => (
            <div
              key={contract.id}
              className="bg-white shadow-lg rounded-3xl p-8 border border-gray-200 space-y-8"
            >
              {/* Contract Header */}
              <div className="border-b pb-4">
                <h2 className="text-2xl font-bold text-blue-700">
                  {contract.general?.contractName}
                </h2>

                <p className="text-gray-700 mt-1 text-lg">
                  {contract.general?.hotelName}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {contract.general?.startDate} → {contract.general?.endDate}
                </p>
              </div>

              {/* Accordions */}
              <div className="space-y-6">

                {/* GENERAL */}
                <Accordion title="General Information">
                  <table className="w-full text-sm border">
                    <tbody>
                      <tr>
                        <td className="p-3 border font-medium">Rate Basis</td>
                        <td className="p-3 border">{contract.general?.rateBasis}</td>
                      </tr>
                      <tr>
                        <td className="p-3 border font-medium">Currency</td>
                        <td className="p-3 border">{contract.general?.currency}</td>
                      </tr>
                      <tr>
                        <td className="p-3 border font-medium">Inclusivity</td>
                        <td className="p-3 border">{contract.general?.inclusivity}</td>
                      </tr>
                      <tr>
                        <td className="p-3 border font-medium">Online Markup</td>
                        <td className="p-3 border">
                          {contract.general?.onlineMarkupPolicy}
                        </td>
                      </tr>

                      {contract.general?.peakPeriods?.map((p, i) => (
                        <tr key={i}>
                          <td className="p-3 border font-medium">
                            Peak Period – {p.name}
                          </td>
                          <td className="p-3 border">
                            {p.startDate} → {p.endDate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Accordion>

                {/* ROOMS */}
                <Accordion title={`Room Rates (${contract.general?.currency})`}>
                  <table className="w-full border text-sm">
                    <thead className="bg-gray-50 font-semibold">
                      <tr>
                        <th className="p-3 border">Room</th>
                        <th className="p-3 border">Max Pax</th>
                        <th className="p-3 border">Period</th>
                        <th className="p-3 border">Single</th>
                        <th className="p-3 border">Double</th>
                        <th className="p-3 border">Triple</th>
                        <th className="p-3 border">Min Nights</th>
                      </tr>
                    </thead>

                    <tbody>
                      {contract.rooms?.map((room, ri) =>
                        room.ratePeriods?.map((rp, idx) => (
                          <tr key={`${ri}-${idx}`}>
                            {idx === 0 && (
                              <>
                                <td
                                  rowSpan={room.ratePeriods.length}
                                  className="p-3 border bg-gray-50 font-medium"
                                >
                                  {room.name}
                                </td>
                                <td
                                  rowSpan={room.ratePeriods.length}
                                  className="p-3 border bg-gray-50"
                                >
                                  {room.maxPax}
                                </td>
                              </>
                            )}

                            <td className="p-3 border">
                              <span className="font-medium">{rp.periodName}</span>
                              <div className="text-xs text-gray-500">
                                {rp.startDate} → {rp.endDate}
                              </div>
                            </td>

                            <td className="p-3 border">{rp.rateSingle}</td>
                            <td className="p-3 border">{rp.rateDouble}</td>
                            <td className="p-3 border">{rp.rateTriple}</td>
                            <td className="p-3 border">{rp.minNights}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </Accordion>

                {/* MEALS */}
                <Accordion title="Meal Supplements">
                  <table className="w-full border text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 border">Type</th>
                        <th className="p-3 border">Cost</th>
                        <th className="p-3 border">Basis</th>
                        <th className="p-3 border">Child Discount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contract.meals?.map((m, i) => (
                        <tr key={i}>
                          <td className="p-3 border">{m.type}</td>
                          <td className="p-3 border">{m.cost}</td>
                          <td className="p-3 border">{m.costBasis}</td>
                          <td className="p-3 border">{m.childDiscountPercent}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Accordion>

                {/* CHILD POLICY */}
                <Accordion title="Child & Extra Policy">
                  <table className="w-full text-sm border">
                    <tbody>
                      <tr>
                        <td className="p-3 border font-medium">FOC Age</td>
                        <td className="p-3 border">
                          {contract.childPolicy?.childFOCAgeMax}
                        </td>
                      </tr>

                      <tr>
                        <td className="p-3 border font-medium">Extra Bed Cost</td>
                        <td className="p-3 border">
                          {contract.childPolicy?.extraBedCost}
                        </td>
                      </tr>

                      <tr>
                        <td className="p-3 border font-medium">Extra Adult Rate</td>
                        <td className="p-3 border">
                          {contract.childPolicy?.extraAdultRate}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Accordion>

                {/* OFFERS */}
                <Accordion title="Special Offers">
                  <table className="w-full border text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 border">Name</th>
                        <th className="p-3 border">Condition</th>
                        <th className="p-3 border">Discount</th>
                        <th className="p-3 border">Combinable</th>
                        <th className="p-3 border">Policy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contract.offers?.map((o, i) => (
                        <tr key={i}>
                          <td className="p-3 border">{o.name}</td>
                          <td className="p-3 border">{o.condition}</td>
                          <td className="p-3 border">{o.discountPercent}%</td>
                          <td className="p-3 border">{o.combinable ? "Yes" : "No"}</td>
                          <td className="p-3 border">{o.relatedPolicy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Accordion>

                {/* TERMS */}
                <Accordion title="Cancellation Terms">
                  <table className="w-full border text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 border">Period</th>
                        <th className="p-3 border">Days</th>
                        <th className="p-3 border">Detail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contract.terms?.map((t, i) => (
                        <tr key={i}>
                          <td className="p-3 border">{t.applicablePeriod}</td>
                          <td className="p-3 border">{t.conditionDays}</td>
                          <td className="p-3 border">{t.policyDetail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Accordion>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
