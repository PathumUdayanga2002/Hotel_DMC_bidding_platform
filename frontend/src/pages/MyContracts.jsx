import React, { useEffect, useState } from "react";
import api from "../services/api";
import html2pdf from "html2pdf.js";
import { ChevronDown } from "lucide-react";

// ----------------------
// Accordion Component
// ----------------------
const Accordion = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-xl shadow-sm bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-4 bg-gray-100 hover:bg-gray-200 transition"
      >
        <h3 className="text-lg font-semibold text-blue-700">{title}</h3>
        <ChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`transition-all duration-300 ${
          open ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

// ----------------------
// Main Component
// ----------------------
export default function MyContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/hotel/contracts/my")
      .then((res) => setContracts(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ----------------------
  // Download PDF
  // ----------------------
  const downloadPDF = (contractId) => {
    const element = document.getElementById(`contract-${contractId}`);

    if (!element) return;

    const options = {
      margin: 0.5,
      filename: `Contract_${contractId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff", // force white background for PDF
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(options).save();
  };

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
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Hotel Contracts</h1>

      <div className="space-y-10">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            id={`contract-${contract.id}`}
            className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200"
            style={{ backgroundColor: "#fff", color: "#000" }} // override for PDF
          >
            {/* HEADER */}
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-blue-700">
                {contract.general.contractName}
              </h2>
              <p className="text-lg text-gray-700">
                Hotel:{" "}
                <span className="font-semibold">{contract.general.hotelName}</span>
              </p>
              <p className="text-gray-600">
                {contract.general.startDate} → {contract.general.endDate}
              </p>
            </div>

            {/* DOWNLOAD BUTTON */}
            {/* <button
              className="mb-6 px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              onClick={() => downloadPDF(contract.id)}
            >
              Download PDF
            </button> */}

            {/* COLLAPSIBLE SECTIONS */}
            <div className="space-y-6">
              {/* 1️⃣ General Info */}
              <Accordion title="General Information">
                <table className="w-full border border-gray-300 text-sm">
                  <tbody>
                    <tr>
                      <td className="p-2 border font-medium">Rate Basis</td>
                      <td className="p-2 border">{contract.general.rateBasis}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-medium">Currency</td>
                      <td className="p-2 border">{contract.general.currency}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-medium">Inclusivity</td>
                      <td className="p-2 border">{contract.general.inclusivity}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-medium">Online Markup Policy</td>
                      <td className="p-2 border">{contract.general.onlineMarkupPolicy}</td>
                    </tr>
                    {contract.general.peakPeriods?.map((p, i) => (
                      <tr key={i}>
                        <td className="p-2 border font-medium">Peak: {p.name}</td>
                        <td className="p-2 border">{p.startDate} → {p.endDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Accordion>

              {/* 2️⃣ Room Rates */}
              <Accordion title={`Room Rates (${contract.general.currency})`}>
                <table className="w-full border text-sm">
                  <thead className="bg-gray-100 font-semibold">
                    <tr>
                      <th className="p-2 border">Room Type</th>
                      <th className="p-2 border">Max Pax</th>
                      <th className="p-2 border">Period</th>
                      <th className="p-2 border">Single</th>
                      <th className="p-2 border">Double</th>
                      <th className="p-2 border">Triple</th>
                      <th className="p-2 border">Min Nights</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contract.rooms?.map((room, ri) =>
                      room.ratePeriods.map((rp, idx) => (
                        <tr key={`${ri}-${idx}`}>
                          {idx === 0 && (
                            <>
                              <td rowSpan={room.ratePeriods.length} className="p-2 border bg-gray-50">{room.name}</td>
                              <td rowSpan={room.ratePeriods.length} className="p-2 border bg-gray-50">{room.maxPax}</td>
                            </>
                          )}
                          <td className="p-2 border">{rp.periodName}<div className="text-xs text-gray-500">{rp.startDate} → {rp.endDate}</div></td>
                          <td className="p-2 border">{rp.rateSingle}</td>
                          <td className="p-2 border">{rp.rateDouble}</td>
                          <td className="p-2 border">{rp.rateTriple}</td>
                          <td className="p-2 border">{rp.minNights}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </Accordion>

              {/* 3️⃣ Meal Supplements */}
              <Accordion title="Meal Supplements">
                <table className="w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">Type</th>
                      <th className="p-2 border">Cost</th>
                      <th className="p-2 border">Basis</th>
                      <th className="p-2 border">Child Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contract.meals?.map((m, mi) => (
                      <tr key={mi}>
                        <td className="p-2 border">{m.type}</td>
                        <td className="p-2 border">{m.cost}</td>
                        <td className="p-2 border">{m.costBasis}</td>
                        <td className="p-2 border">{m.childDiscountPercent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Accordion>

              {/* 4️⃣ Child Policy */}
              <Accordion title="Child & Extra Policy">
                <table className="w-full border text-sm">
                  <tbody>
                    <tr>
                      <td className="p-2 border font-medium">FOC Age Max</td>
                      <td className="p-2 border">{contract.childPolicy.childFOCAgeMax}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-medium">Extra Bed Cost</td>
                      <td className="p-2 border">{contract.childPolicy.extraBedCost}</td>
                    </tr>
                    <tr>
                      <td className="p-2 border font-medium">Extra Adult Rate</td>
                      <td className="p-2 border">{contract.childPolicy.extraAdultRate}</td>
                    </tr>
                  </tbody>
                </table>
              </Accordion>

              {/* 5️⃣ Special Offers */}
              <Accordion title="Special Offers">
                <table className="w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">Condition</th>
                      <th className="p-2 border">Discount</th>
                      <th className="p-2 border">Combinable</th>
                      <th className="p-2 border">Policy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contract.offers?.map((o, oi) => (
                      <tr key={oi}>
                        <td className="p-2 border">{o.name}</td>
                        <td className="p-2 border">{o.condition}</td>
                        <td className="p-2 border">{o.discountPercent}%</td>
                        <td className="p-2 border">{o.combinable ? "Yes" : "No"}</td>
                        <td className="p-2 border">{o.relatedPolicy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Accordion>

              {/* 6️⃣ Cancellation Terms */}
              <Accordion title="Cancellation Terms">
                <table className="w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">Period</th>
                      <th className="p-2 border">Days</th>
                      <th className="p-2 border">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contract.terms?.map((t, ti) => (
                      <tr key={ti}>
                        <td className="p-2 border">{t.applicablePeriod}</td>
                        <td className="p-2 border">{t.conditionDays}</td>
                        <td className="p-2 border">{t.policyDetail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Accordion>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
