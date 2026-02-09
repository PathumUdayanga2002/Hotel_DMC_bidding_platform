import React, { useEffect, useState } from "react";
import api from "../services/api";
import { ChevronDown, FileText, Calendar, DollarSign, Users, Loader2 } from "lucide-react";

// Modern Minimal Accordion
const Accordion = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-teal-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100 hover:to-emerald-100 transition font-semibold text-teal-900 border-b border-teal-200"
      >
        <span className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-teal-600" />}
          {title}
        </span>
        <ChevronDown
          className={`transition-transform text-teal-600 ${open ? "rotate-180" : ""}`}
          size={20}
        />
      </button>

      <div
        className={`transition-all duration-300 ${
          open ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-6 bg-white">{children}</div>
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
      .then((res) => {
        const data = res.data || [];
        // Sort by creation date, latest first
        const sorted = data.sort((a, b) => {
          const dateA = new Date(a.general?.startDate || 0);
          const dateB = new Date(b.general?.startDate || 0);
          return dateB - dateA;
        });
        setContracts(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 md:p-10 bg-gradient-to-br from-teal-50 via-white to-emerald-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-teal-900">Loading Contracts...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-10 bg-gradient-to-br from-teal-50 via-white to-emerald-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-teal-900">
              My Hotel Contracts
            </h1>
          </div>
          <p className="text-teal-700 text-lg ml-14">Manage and view all your hotel contracts</p>
        </div>

        {/* No Contracts */}
        {contracts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-teal-200">
            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-teal-900 mb-2">No Contracts Yet</h2>
            <p className="text-teal-700 text-lg">
              Create your first contract using the Contract Builder to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {contracts.map((contract, index) => (
              <div
                key={contract.id}
                className="bg-white shadow-lg rounded-2xl overflow-hidden border-l-4 border-l-teal-500 hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1"
              >
                {/* Contract Badge - Latest */}
                {index === 0 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold z-10">
                    Latest
                  </div>
                )}
                {/* Contract Header */}
                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-8 text-white">
                  <h2 className="text-3xl font-bold mb-2">
                    {contract.general?.contractName}
                  </h2>
                  <p className="text-teal-100 text-lg mb-1">
                    {contract.general?.hotelName}
                  </p>
                  <div className="flex items-center gap-2 text-teal-100">
                    <Calendar className="w-5 h-5" />
                    <p className="text-sm">
                      {contract.general?.startDate} → {contract.general?.endDate}
                    </p>
                  </div>
                </div>

                {/* Accordions */}
                <div className="p-8 space-y-6">

                  {/* GENERAL */}
                  <Accordion title="General Information" icon={DollarSign}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                        <p className="text-sm font-semibold text-teal-700 mb-1">Rate Basis</p>
                        <p className="text-lg font-bold text-teal-900">{contract.general?.rateBasis}</p>
                      </div>
                      <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                        <p className="text-sm font-semibold text-teal-700 mb-1">Currency</p>
                        <p className="text-lg font-bold text-teal-900">{contract.general?.currency}</p>
                      </div>
                      <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                        <p className="text-sm font-semibold text-teal-700 mb-1">Inclusivity</p>
                        <p className="text-lg font-bold text-teal-900">{contract.general?.inclusivity}</p>
                      </div>
                      <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                        <p className="text-sm font-semibold text-teal-700 mb-1">Online Markup</p>
                        <p className="text-lg font-bold text-teal-900">{contract.general?.onlineMarkupPolicy}</p>
                      </div>
                      {contract.general?.peakPeriods?.map((p, i) => (
                        <div key={i} className="bg-amber-50 p-4 rounded-lg border border-amber-200 md:col-span-2">
                          <p className="text-sm font-semibold text-amber-700 mb-1">Peak Period – {p.name}</p>
                          <p className="text-lg font-bold text-amber-900">{p.startDate} → {p.endDate}</p>
                        </div>
                      ))}
                    </div>
                  </Accordion>

                  {/* ROOMS */}
                  <Accordion title={`Room Rates (${contract.general?.currency})`} icon={Users}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gradient-to-r from-teal-100 to-emerald-100 border-b-2 border-teal-300">
                            <th className="p-3 text-left font-semibold text-teal-900">Room</th>
                            <th className="p-3 text-left font-semibold text-teal-900">Max Pax</th>
                            <th className="p-3 text-left font-semibold text-teal-900">Period</th>
                            <th className="p-3 text-left font-semibold text-teal-900">Single</th>
                            <th className="p-3 text-left font-semibold text-teal-900">Double</th>
                            <th className="p-3 text-left font-semibold text-teal-900">Triple</th>
                            <th className="p-3 text-left font-semibold text-teal-900">Min Nights</th>
                          </tr>
                        </thead>

                        <tbody>
                          {contract.rooms?.map((room, ri) =>
                            room.ratePeriods?.map((rp, idx) => (
                              <tr key={`${ri}-${idx}`} className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-teal-50'} hover:bg-teal-100 transition`}>
                                {idx === 0 && (
                                  <>
                                    <td
                                      rowSpan={room.ratePeriods.length}
                                      className="p-3 bg-gradient-to-b from-teal-100 to-teal-50 font-semibold text-teal-900"
                                    >
                                      {room.name}
                                    </td>
                                    <td
                                      rowSpan={room.ratePeriods.length}
                                      className="p-3 bg-gradient-to-b from-teal-100 to-teal-50 text-center font-bold text-teal-900"
                                    >
                                      {room.maxPax}
                                    </td>
                                  </>
                                )}

                                <td className="p-3">
                                  <span className="font-medium text-teal-900">{rp.periodName}</span>
                                  <div className="text-xs text-teal-600">
                                    {rp.startDate} → {rp.endDate}
                                  </div>
                                </td>

                                <td className="p-3 font-semibold text-emerald-700">{rp.rateSingle}</td>
                                <td className="p-3 font-semibold text-emerald-700">{rp.rateDouble}</td>
                                <td className="p-3 font-semibold text-emerald-700">{rp.rateTriple}</td>
                                <td className="p-3 text-center font-bold text-teal-900">{rp.minNights}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </Accordion>

                  {/* MEALS */}
                  <Accordion title="Meal Supplements">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gradient-to-r from-teal-100 to-emerald-100 border-b-2 border-teal-300">
                            <th className="p-3 text-left font-semibold text-teal-900">Type</th>
                            <th className="p-3 text-left font-semibold text-teal-900">Cost</th>
                            <th className="p-3 text-left font-semibold text-teal-900">Basis</th>
                            <th className="p-3 text-left font-semibold text-teal-900">Child Discount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contract.meals?.map((m, i) => (
                            <tr key={i} className={`border-b ${i % 2 === 0 ? 'bg-white' : 'bg-teal-50'} hover:bg-teal-100 transition`}>
                              <td className="p-3 font-medium text-teal-900">{m.type}</td>
                              <td className="p-3 font-semibold text-emerald-700">{m.cost}</td>
                              <td className="p-3 text-teal-700">{m.costBasis}</td>
                              <td className="p-3 font-bold text-teal-900">{m.childDiscountPercent}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Accordion>

                  {/* CHILD POLICY */}
                  <Accordion title="Child & Extra Policy" icon={Users}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                        <p className="text-sm font-semibold text-teal-700 mb-1">FOC Age</p>
                        <p className="text-2xl font-bold text-teal-900">
                          {contract.childPolicy?.childFOCAgeMax}
                        </p>
                      </div>

                      <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                        <p className="text-sm font-semibold text-teal-700 mb-1">Extra Bed Cost</p>
                        <p className="text-2xl font-bold text-teal-900">
                          {contract.childPolicy?.extraBedCost}
                        </p>
                      </div>

                      <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                        <p className="text-sm font-semibold text-teal-700 mb-1">Extra Adult Rate</p>
                        <p className="text-2xl font-bold text-teal-900">
                          {contract.childPolicy?.extraAdultRate}
                        </p>
                      </div>
                    </div>
                  </Accordion>

                  {/* OFFERS */}
                  <Accordion title="Special Offers">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gradient-to-r from-amber-100 to-orange-100 border-b-2 border-amber-300">
                            <th className="p-3 text-left font-semibold text-amber-900">Name</th>
                            <th className="p-3 text-left font-semibold text-amber-900">Condition</th>
                            <th className="p-3 text-left font-semibold text-amber-900">Discount</th>
                            <th className="p-3 text-left font-semibold text-amber-900">Combinable</th>
                            <th className="p-3 text-left font-semibold text-amber-900">Policy</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contract.offers?.map((o, i) => (
                            <tr key={i} className={`border-b ${i % 2 === 0 ? 'bg-white' : 'bg-amber-50'} hover:bg-amber-100 transition`}>
                              <td className="p-3 font-medium text-amber-900">{o.name}</td>
                              <td className="p-3 text-amber-800">{o.condition}</td>
                              <td className="p-3 font-bold text-emerald-700">{o.discountPercent}%</td>
                              <td className="p-3"><span className={`px-3 py-1 rounded-full text-xs font-bold ${o.combinable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{o.combinable ? "Yes" : "No"}</span></td>
                              <td className="p-3 text-amber-800">{o.relatedPolicy}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Accordion>

                  {/* TERMS */}
                  <Accordion title="Cancellation Terms">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gradient-to-r from-red-100 to-pink-100 border-b-2 border-red-300">
                            <th className="p-3 text-left font-semibold text-red-900">Period</th>
                            <th className="p-3 text-left font-semibold text-red-900">Days</th>
                            <th className="p-3 text-left font-semibold text-red-900">Detail</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contract.terms?.map((t, i) => (
                            <tr key={i} className={`border-b ${i % 2 === 0 ? 'bg-white' : 'bg-red-50'} hover:bg-red-100 transition`}>
                              <td className="p-3 font-medium text-red-900">{t.applicablePeriod}</td>
                              <td className="p-3 text-center font-bold text-red-900">{t.conditionDays}</td>
                              <td className="p-3 text-red-800">{t.policyDetail}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Accordion>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
