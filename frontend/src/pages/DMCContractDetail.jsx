import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ChevronDown, ArrowLeft } from 'lucide-react';

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
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>

      <div
        className={`transition-all duration-300 ${
          open ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

const DMCContractDetail = () => {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const resp = await api.get(`/send-contract/view/${contractId}`);
      const data = resp?.data?.data || null;
      setContract(data);
    } catch (err) {
      console.error('Failed to load contract detail', err);
      setContract(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 bg-gray-100 min-h-screen animate-pulse">
        <h1 className="text-3xl font-semibold mb-6">Contract Details</h1>
        <p className="text-gray-600">Loading contract...</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-10 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <button className="flex items-center gap-2 text-sm text-gray-700 mb-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="bg-white rounded-2xl shadow p-8 text-center border">
            <h2 className="text-xl font-semibold text-gray-800">Contract Not Available</h2>
            <p className="text-gray-600 mt-2">Either the contract is not found or you are not authorized to view it.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{contract.general?.contractName || 'Contract Details'}</h1>
            <p className="text-gray-600 mt-1">{contract.general?.hotelName}</p>
            <p className="text-sm text-gray-500 mt-1">{contract.general?.startDate} → {contract.general?.endDate}</p>
          </div>
          <div>
            <button className="text-sm text-gray-700" onClick={() => navigate(-1)}>Back</button>
          </div>
        </div>

        <div className="space-y-6">
          {/* GENERAL */}
          <Accordion title="General Information" defaultOpen={true}>
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
                  <td className="p-3 border">{contract.general?.onlineMarkupPolicy}</td>
                </tr>

                {contract.general?.peakPeriods?.map((p, i) => (
                  <tr key={i}>
                    <td className="p-3 border font-medium">Peak Period – {p.name}</td>
                    <td className="p-3 border">{p.startDate} → {p.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Accordion>

          {/* ROOMS */}
          <Accordion title={`Room Rates (${contract.general?.currency || ''})`}>
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
                          <td rowSpan={room.ratePeriods.length} className="p-3 border bg-gray-50 font-medium">{room.name}</td>
                          <td rowSpan={room.ratePeriods.length} className="p-3 border bg-gray-50">{room.maxPax}</td>
                        </>
                      )}

                      <td className="p-3 border">
                        <span className="font-medium">{rp.periodName}</span>
                        <div className="text-xs text-gray-500">{rp.startDate} → {rp.endDate}</div>
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
                  <td className="p-3 border">{contract.childPolicy?.childFOCAgeMax}</td>
                </tr>

                <tr>
                  <td className="p-3 border font-medium">Extra Bed Cost</td>
                  <td className="p-3 border">{contract.childPolicy?.extraBedCost}</td>
                </tr>

                <tr>
                  <td className="p-3 border font-medium">Extra Adult Rate</td>
                  <td className="p-3 border">{contract.childPolicy?.extraAdultRate}</td>
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
                    <td className="p-3 border">{o.combinable ? 'Yes' : 'No'}</td>
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
    </div>
  );
};

export default DMCContractDetail;
