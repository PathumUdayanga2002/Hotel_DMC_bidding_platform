import React, { useEffect, useState } from "react";
import { Trash2, PlusCircle, Save, PlusSquare } from "lucide-react";

// ====================================================================
// Rate Period Editor
// ====================================================================
const RatePeriodEditor = ({ roomId, period, updateLocalPeriod, addPeriod, removePeriod }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm">
    <div className="flex-1">
      <div className="flex gap-2 items-center flex-wrap">
        <input
          value={period.periodName}
          onChange={(e) => updateLocalPeriod(roomId, period.id, "periodName", e.target.value)}
          placeholder="Period Name"
          className="p-2 border border-gray-300 rounded-md w-full md:w-48 focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex gap-2">
          <input
            type="date"
            value={period.startDate}
            onChange={(e) => updateLocalPeriod(roomId, period.id, "startDate", e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="date"
            value={period.endDate}
            onChange={(e) => updateLocalPeriod(roomId, period.id, "endDate", e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
        {["rateSingle", "rateDouble", "rateTriple", "minNights"].map((field) => (
          <input
            key={field}
            type={field === "minNights" ? "number" : "number"}
            value={period[field]}
            onChange={(e) => updateLocalPeriod(roomId, period.id, field, e.target.value)}
            placeholder={field.replace("rate", "").replace("Nights", "Min Nights")}
            className="p-2 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-blue-400"
          />
        ))}
      </div>
    </div>

    <div className="flex-shrink-0 flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => addPeriod(roomId)}
          className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
        >
          <PlusCircle size={16} /> Period
        </button>
        <button
          type="button"
          onClick={() => removePeriod(roomId, period.id)}
          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
        >
          <Trash2 size={16} /> Remove
        </button>
      </div>
    </div>
  </div>
);

// ====================================================================
// Room Card
// ====================================================================
const RoomCard = ({ room, updateLocalRoom, updateLocalPeriod, addPeriod, removePeriod, removeRoom }) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-md p-4">
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div className="flex-1">
        <div className="flex gap-3 items-center flex-wrap">
          <input
            value={room.name}
            onChange={(e) => updateLocalRoom(room.id, "name", e.target.value)}
            placeholder="Room Name"
            className="w-64 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Units</label>
            <input
              value={room.units}
              onChange={(e) => updateLocalRoom(room.id, "units", e.target.value)}
              type="number"
              min={0}
              className="w-20 p-2 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Max Pax</label>
            <input
              value={room.maxPax}
              onChange={(e) => updateLocalRoom(room.id, "maxPax", e.target.value)}
              type="number"
              min={0}
              className="w-20 p-2 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="mt-3 grid gap-3">
          {room.ratePeriods.map((p) => (
            <RatePeriodEditor
              key={p.id}
              roomId={room.id}
              period={p}
              updateLocalPeriod={updateLocalPeriod}
              addPeriod={addPeriod}
              removePeriod={removePeriod}
            />
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => removeRoom(room.id)}
          className="flex items-center gap-1 text-red-600 hover:text-red-700 transition text-sm"
        >
          <Trash2 size={16} /> Delete Room
        </button>
      </div>
    </div>
  </div>
);

// ====================================================================
// Main Component
// ====================================================================
export default function RoomRatesFormModern({ rooms, setRooms }) {
  const [localRooms, setLocalRooms] = useState([]);

  useEffect(() => {
    if (!rooms || rooms.length === 0) {
      const defaultRoom = {
        id: Date.now(),
        name: "Room 1",
        units: "1",
        maxPax: "2",
        ratePeriods: [
          { id: 1, periodName: "Default Period", startDate: "", endDate: "", rateSingle: "", rateDouble: "", rateTriple: "", minNights: "" },
        ],
      };
      setLocalRooms([defaultRoom]);
      setRooms([
        {
          name: defaultRoom.name,
          units: 1,
          maxPax: 2,
          ratePeriods: defaultRoom.ratePeriods.map((rp) => ({ ...rp, rateSingle: null, rateDouble: null, rateTriple: null, minNights: null })),
        },
      ]);
      return;
    }

    const mapped = rooms.map((r, idx) => ({
      id: r.id ?? Date.now() + idx,
      name: r.name ?? "",
      units: String(r.units ?? "1"),
      maxPax: String(r.maxPax ?? "2"),
      ratePeriods: (r.ratePeriods ?? []).map((p, pidx) => ({
        id: p.id ?? `${idx}-${pidx}`,
        periodName: p.periodName ?? "",
        startDate: p.startDate ?? "",
        endDate: p.endDate ?? "",
        rateSingle: p.rateSingle ?? "",
        rateDouble: p.rateDouble ?? "",
        rateTriple: p.rateTriple ?? "",
        minNights: p.minNights ?? "",
      })),
    }));
    setLocalRooms(mapped);
  }, [rooms, setRooms]);

  const updateLocalRoom = (roomId, field, value) => {
    setLocalRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, [field]: value } : r)));
  };

  const updateLocalPeriod = (roomId, periodId, field, value) => {
    setLocalRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? { ...room, ratePeriods: room.ratePeriods.map((p) => (p.id === periodId ? { ...p, [field]: value } : p)) }
          : room
      )
    );
  };

  const addRoom = () => {
    const newRoom = {
      id: Date.now(),
      name: "New Room",
      units: "1",
      maxPax: "2",
      ratePeriods: [{ id: Date.now() + 1, periodName: "New Period", startDate: "", endDate: "", rateSingle: "", rateDouble: "", rateTriple: "", minNights: "" }],
    };
    setLocalRooms((prev) => [...prev, newRoom]);
  };

  const removeRoom = (roomId) => {
    setLocalRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  const addPeriod = (roomId) => {
    setLocalRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? {
              ...r,
              ratePeriods: [
                ...r.ratePeriods,
                { id: Date.now(), periodName: "New Period", startDate: "", endDate: "", rateSingle: "", rateDouble: "", rateTriple: "", minNights: "" },
              ],
            }
          : r
      )
    );
  };

  const removePeriod = (roomId, periodId) => {
    setLocalRooms((prev) =>
      prev.map((r) => {
        if (r.id !== roomId) return r;
        const newPeriods = r.ratePeriods.filter((p) => p.id !== periodId);
        return {
          ...r,
          ratePeriods:
            newPeriods.length > 0
              ? newPeriods
              : [{ id: Date.now(), periodName: "Default Period", startDate: "", endDate: "", rateSingle: "", rateDouble: "", rateTriple: "", minNights: "" }],
        };
      })
    );
  };

  const saveToParent = () => {
    const normalized = localRooms.map((r) => ({
      name: r.name,
      units: Number(r.units) || 0,
      maxPax: Number(r.maxPax) || 0,
      ratePeriods: r.ratePeriods.map((p) => ({
        periodName: p.periodName,
        startDate: p.startDate,
        endDate: p.endDate,
        rateSingle: p.rateSingle === "" ? null : Number(p.rateSingle),
        rateDouble: p.rateDouble === "" ? null : Number(p.rateDouble),
        rateTriple: p.rateTriple === "" ? null : Number(p.rateTriple),
        minNights: p.minNights === "" ? null : Number(p.minNights),
      })),
    }));

    setRooms(normalized);
    alert("Rates saved to parent state!");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap">
        <h3 className="text-lg font-semibold">Room Rates (Modern)</h3>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={addRoom}
            className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            <PlusSquare size={16} /> Add Room
          </button>
          <button
            type="button"
            onClick={saveToParent}
            className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {localRooms.map((r) => (
          <RoomCard
            key={r.id}
            room={r}
            updateLocalRoom={updateLocalRoom}
            updateLocalPeriod={updateLocalPeriod}
            addPeriod={addPeriod}
            removePeriod={removePeriod}
            removeRoom={removeRoom}
          />
        ))}
      </div>

      <div className="pt-4 text-sm text-gray-500">
        Tip: fields are stored as text while typing to keep focus/caret stable. Click **Save** to convert numbers for backend use.
      </div>
    </div>
  );
}
