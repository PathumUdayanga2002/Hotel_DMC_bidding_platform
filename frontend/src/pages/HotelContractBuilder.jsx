import React, { useState } from "react";
import GeneralContractForm from "./contract/GeneralContractForm";
import RoomRatesForm from "./contract/RoomRatesForm";
import MealSupplementsForm from "./contract/MealSupplementsForm";
import ChildPolicyForm from "./contract/ChildPolicyForm";
import OffersForm from "./contract/OffersForm";
import ValueAddedForm from "./contract/ValueAddedForm";
import TermsConditionsForm from "./contract/TermsConditionsForm";
import Tabs from "./contract/Tabs";
import api from "../services/api";

export default function ContractBuilder() {
  const [activeTab, setActiveTab] = useState(0);

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

  const tabs = [
    { label: "General", content: <GeneralContractForm general={general} setGeneral={setGeneral} /> },
    { label: "Rooms", content: <RoomRatesForm rooms={rooms} setRooms={setRooms} /> },
    { label: "Meals", content: <MealSupplementsForm meals={meals} setMeals={setMeals} /> },
    { label: "Child Policy", content: <ChildPolicyForm childPolicy={childPolicy} setChildPolicy={setChildPolicy} /> },
    { label: "Offers", content: <OffersForm offers={offers} setOffers={setOffers} /> },
    { label: "Value Added", content: <ValueAddedForm valueAdded={valueAdded} setValueAdded={setValueAdded} /> },
    { label: "T&C", content: <TermsConditionsForm terms={terms} setTerms={setTerms} /> },
  ];

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

      const response = await api.post("/hotel/contracts", finalContract);
      console.log("Contract saved:", response.data);
      alert("Contract saved successfully!");
    } catch (error) {
      console.error("Error saving contract:", error);
      alert("Failed to save contract. Check console for details.");
    }
  };

  return (
    <div className="mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">📝 Hotel Contract Builder</h1>

      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-6 text-center">
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600"
        >
          Save Contract
        </button>
      </div>
    </div>
  );
}
