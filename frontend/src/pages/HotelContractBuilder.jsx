import React, { useState, useRef } from "react";
import GeneralContractForm from "./contract/GeneralContractForm";
import RoomRatesForm from "./contract/RoomRatesForm";
import MealSupplementsForm from "./contract/MealSupplementsForm";
import ChildPolicyForm from "./contract/ChildPolicyForm";
import OffersForm from "./contract/OffersForm";
import ValueAddedForm from "./contract/ValueAddedForm";
import TermsConditionsForm from "./contract/TermsConditionsForm";
import Tabs from "./contract/Tabs";
import api from "../services/api";
import SendContractPanel from '../components/SendContractPanel';

export default function ContractBuilder() {
  const [activeTab, setActiveTab] = useState(0);
  const [showPayloadPreview, setShowPayloadPreview] = useState(false);
  const [savedContractId, setSavedContractId] = useState(null);

  const [general, setGeneral] = useState({
    contractName: "",
    hotelName: "",
    startDate: "",
    endDate: "",
    rateBasis: "",
    currency: "",
    inclusivity: "",
    onlineMarkupPolicy: "",
    governmentTaxNote: "",
    peakPeriods: [],
  });

  const [rooms, setRooms] = useState([]);
  const [meals, setMeals] = useState([]);
  const [childPolicy, setChildPolicy] = useState({
    childFOCAgeMax: 0,
    childFOCConditions: "",
    childMealDiscountAgeRange: "",
    childMealDiscountPercent: 0,
    extraBedChargeAge: "",
    extraBedCost: 0,
    extraAdultDefinition: "",
    extraAdultRate: 0,
    driverAccommodation: "",
    driverAllowanceAmount: 0,
    driverAllowanceCurrency: "",
  });

  const [offers, setOffers] = useState([]);
  const [valueAdded, setValueAdded] = useState([]);
  const [terms, setTerms] = useState([]);

  // ref to allow programmatic save on rooms form
  const roomRatesRef = useRef(null);

  const tabs = [
    { label: "General", content: <GeneralContractForm general={general} setGeneral={setGeneral} /> },
    { label: "Rooms", content: <RoomRatesForm ref={roomRatesRef} rooms={rooms} setRooms={setRooms} /> },
    { label: "Meals", content: <MealSupplementsForm meals={meals} setMeals={setMeals} /> },
    { label: "Child Policy", content: <ChildPolicyForm childPolicy={childPolicy} setChildPolicy={setChildPolicy} /> },
    { label: "Offers", content: <OffersForm offers={offers} setOffers={setOffers} /> },
    { label: "Value Added", content: <ValueAddedForm valueAdded={valueAdded} setValueAdded={setValueAdded} /> },
    { label: "T&C", content: <TermsConditionsForm terms={terms} setTerms={setTerms} /> },
  ];

  // beforeNext hook for Tabs: when leaving Rooms tab, trigger the RoomRatesForm save
  const handleBeforeNext = async (currentIndex) => {
    // index 1 is Rooms
    if (currentIndex === 1) {
      try {
        if (roomRatesRef.current && typeof roomRatesRef.current.save === 'function') {
          // call silent save (no banner) when navigating automatically
          roomRatesRef.current.save(true);
        }
      } catch (e) {
        console.error('Failed to save rooms before navigating:', e);
        // returning false would cancel navigation; we'll allow navigation but log error
      }
    }
    return true;
  };

  const handleSave = async () => {
    try {
      const finalContract = {
        general,
        rooms,
        meals,
        childPolicy,
        offers,
        valueAdded,
        terms,
      };

      // Diagnostic log: inspect the contract payload being sent
      console.log('Saving contract payload:', JSON.stringify(finalContract, null, 2));

      // Basic validation: ensure rooms have at least one non-default rate period
      const invalidRooms = (rooms || []).filter((room) => {
        if (!room?.ratePeriods || room.ratePeriods.length === 0) return true;
        // If every period has zero rates / empty periodName and no dates, consider invalid
        return room.ratePeriods.every((rp) => {
          const hasName = rp.periodName && rp.periodName.trim() !== '';
          const hasDates = (rp.startDate && rp.startDate.trim()) || (rp.endDate && rp.endDate.trim());
          const hasRates = (Number(rp.rateSingle) || 0) > 0 || (Number(rp.rateDouble) || 0) > 0 || (Number(rp.rateTriple) || 0) > 0;
          return !(hasName || hasDates || hasRates);
        });
      });

      if (invalidRooms.length > 0) {
        if (!window.confirm('Some rooms appear to have only default/empty rate periods. Are you sure you want to save?')) {
          return;
        }
      }

      const response = await api.post("/hotel/contracts", finalContract);
      console.log("Contract saved:", response.data);
      alert("Contract saved successfully!");

      // capture saved contract id so user can send it to DMCs
      const payload = response?.data || {};
      const id = payload?.id || payload?._id || null;
      if (id) setSavedContractId(id);
    } catch (error) {
      console.error("Error saving contract:", error);
      alert("Failed to save contract. Check console for details.");
    }
  };

  return (
    <div className="mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Hotel Contract Builder</h1>
          <p className="text-sm text-gray-600">Create and manage contract rates, policies and value-adds for your hotel. Use the tabs to progress through the sections; rooms will auto-save when moving forward.</p>
          <div className="mt-4 flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowPayloadPreview((s) => !s)}
              className="px-3 py-2 border rounded-md text-sm bg-white hover:bg-gray-50"
            >
              {showPayloadPreview ? 'Hide' : 'Preview'} Payload
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} onSave={handleSave} beforeNext={handleBeforeNext} />

          {showPayloadPreview && (
            <div className="mb-6 bg-gray-50 border rounded p-4 mt-4">
              <h3 className="font-semibold mb-2">Payload Preview</h3>
              <pre className="text-xs max-h-64 overflow-auto bg-white p-2 rounded">{JSON.stringify({ general, rooms, meals, childPolicy, offers, valueAdded, terms }, null, 2)}</pre>
            </div>
          )}

          <div className="mt-6">
            <SendContractPanel contractId={savedContractId} onSent={(saved) => console.log('SentContract:', saved)} />
          </div>
        </div>
      </div>
    </div>
  );
}
