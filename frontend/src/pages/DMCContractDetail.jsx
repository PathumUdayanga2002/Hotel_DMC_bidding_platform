import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ChevronDown, ArrowLeft } from 'lucide-react';

// Modern Minimal Accordion
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-6 py-4 bg-white/5 hover:bg-white/10 transition font-medium text-white"
      >
        <span>{title}</span>
        <ChevronDown
          className={`transition-transform ${open ? 'rotate-180' : ''} text-gray-300`}
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
      <div className="min-h-screen bg-[#0f0f0f] px-6 lg:px-12 py-10 animate-pulse">
        <h1 className="text-2xl font-bold text-white mb-6">Contract Details</h1>
        <p className="text-sm text-gray-400">Loading contract...</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] px-6 lg:px-12 py-10">
        <div className="max-w-4xl mx-auto">
          <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
            <h2 className="text-lg font-semibold text-white">Contract Not Available</h2>
            <p className="text-sm text-gray-400 mt-2">Either the contract is not found or you are not authorized to view it.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="px-6 lg:px-12 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{contract.general?.contractName || 'Contract Details'}</h1>
              <p className="text-sm text-gray-300 mt-1">{contract.general?.hotelName}</p>
              <p className="text-sm text-gray-400 mt-1">{contract.general?.startDate} → {contract.general?.endDate}</p>
            </div>
            <button 
              className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-gray-300" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-12 py-10">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* GENERAL */}
          <Accordion title="General Information" defaultOpen={true}>
            <table className="w-full text-sm border border-white/10">
              <tbody>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-3 border border-white/10 font-medium text-gray-300">Rate Basis</td>
                  <td className="p-3 border border-white/10 text-white">{contract.general?.rateBasis}</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-3 border border-white/10 font-medium text-gray-300">Currency</td>
                  <td className="p-3 border border-white/10 text-white">{contract.general?.currency}</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-3 border border-white/10 font-medium text-gray-300">Inclusivity</td>
                  <td className="p-3 border border-white/10 text-white">{contract.general?.inclusivity}</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-3 border border-white/10 font-medium text-gray-300">Online Markup</td>
                  <td className="p-3 border border-white/10 text-white">{contract.general?.onlineMarkupPolicy}</td>
                </tr>

                {contract.general?.peakPeriods?.map((p, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 border border-white/10 font-medium text-gray-300">Peak Period – {p.name}</td>
                    <td className="p-3 border border-white/10 text-white">{p.startDate} → {p.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Accordion>

          {/* ROOMS */}
          <Accordion title={`Room Rates (${contract.general?.currency || ''})`}>
            <table className="w-full border border-white/10 text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Room</th>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Max Pax</th>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Period</th>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Single</th>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Double</th>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Triple</th>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Min Nights</th>
                </tr>
              </thead>
              <tbody>
                {contract.rooms?.map((room, ri) =>
                  room.ratePeriods?.map((rp, idx) => (
                    <tr key={`${ri}-${idx}`} className="hover:bg-white/5 transition-colors">
                      {idx === 0 && (
                        <>
                          <td rowSpan={room.ratePeriods.length} className="p-3 border border-white/10 bg-white/5 font-medium text-white">{room.name}</td>
                          <td rowSpan={room.ratePeriods.length} className="p-3 border border-white/10 bg-white/5 text-white">{room.maxPax}</td>
                        </>
                      )}

                      <td className="p-3 border border-white/10">
                        <span className="font-medium text-white">{rp.periodName}</span>
                        <div className="text-xs text-gray-400">{rp.startDate} → {rp.endDate}</div>
                      </td>

                      <td className="p-3 border border-white/10 text-white">{rp.rateSingle}</td>
                      <td className="p-3 border border-white/10 text-white">{rp.rateDouble}</td>
                      <td className="p-3 border border-white/10 text-white">{rp.rateTriple}</td>
                      <td className="p-3 border border-white/10 text-white">{rp.minNights}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Accordion>

          {/* MEALS */}
          <Accordion title="Meal Supplements">
            <table className="w-full border border-white/10 text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Type</th>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Cost</th>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Basis</th>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Child Discount</th>
                </tr>
              </thead>
              <tbody>
                {contract.meals?.map((m, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 border border-white/10 text-white">{m.type}</td>
                    <td className="p-3 border border-white/10 text-white">{m.cost}</td>
                    <td className="p-3 border border-white/10 text-white">{m.costBasis}</td>
                    <td className="p-3 border border-white/10 text-white">{m.childDiscountPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Accordion>

          {/* CHILD POLICY */}
          <Accordion title="Child & Extra Policy">
            <table className="w-full text-sm border border-white/10">
              <tbody>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-3 border border-white/10 font-medium text-gray-300">FOC Age</td>
                  <td className="p-3 border border-white/10 text-white">{contract.childPolicy?.childFOCAgeMax}</td>
                </tr>

                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-3 border border-white/10 font-medium text-gray-300">Extra Bed Cost</td>
                  <td className="p-3 border border-white/10 text-white">{contract.childPolicy?.extraBedCost}</td>
                </tr>

                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-3 border border-white/10 font-medium text-gray-300">Extra Adult Rate</td>
                  <td className="p-3 border border-white/10 text-white">{contract.childPolicy?.extraAdultRate}</td>
                </tr>
              </tbody>
            </table>
          </Accordion>

          {/* OFFERS */}
          <Accordion title="Special Offers">
            <table className="w-full border border-white/10 text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Name</th>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Condition</th>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Discount</th>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Combinable</th>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Policy</th>
                </tr>
              </thead>
              <tbody>
                {contract.offers?.map((o, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 border border-white/10 text-white">{o.name}</td>
                    <td className="p-3 border border-white/10 text-white">{o.condition}</td>
                    <td className="p-3 border border-white/10 text-white">{o.discountPercent}%</td>
                    <td className="p-3 border border-white/10 text-white">{o.combinable ? 'Yes' : 'No'}</td>
                    <td className="p-3 border border-white/10 text-white">{o.relatedPolicy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Accordion>

          {/* TERMS */}
          <Accordion title="Cancellation Terms">
            <table className="w-full border border-white/10 text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Period</th>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Days</th>
                  <th className="p-3 border border-white/10 text-gray-300 font-medium text-left">Detail</th>
                </tr>
              </thead>
              <tbody>
                {contract.terms?.map((t, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 border border-white/10 text-white">{t.applicablePeriod}</td>
                    <td className="p-3 border border-white/10 text-white">{t.conditionDays}</td>
                    <td className="p-3 border border-white/10 text-white">{t.policyDetail}</td>
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
