import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { db } from "../Firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const SensorSelectionForm = ({ onSensorsUpdated }) => {
  const { userId } = useAuth();
  const [selectedSensors, setSelectedSensors] = useState([]);
  const [noSensors, setNoSensors] = useState(false);

  const handleSensorChange = (e) => {
    const value = e.target.value;
    setSelectedSensors((prevState) =>
      prevState.includes(value)
        ? prevState.filter((sensor) => sensor !== value)
        : [...prevState, value]
    );
  };

  const handleNoSensorsChange = (e) => {
    setNoSensors(e.target.checked);
    if (e.target.checked) {
      setSelectedSensors([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userId) {
      try {
        await setDoc(
          doc(db, "users", userId),
          {
            Sensors: noSensors ? [] : selectedSensors,
            noSensors: noSensors,
          },
          { merge: true }
        );

        alert("Sensors saved successfully!");

        onSensorsUpdated(noSensors ? [] : selectedSensors);
      } catch (error) {
        console.error("Error saving sensors:", error);
        alert("Error saving sensors. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Select Your Installed Sensors</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          <input
            type="checkbox"
            value="FireSensor"
            disabled={noSensors}
            checked={selectedSensors.includes("FireSensor")}
            onChange={handleSensorChange}
          />
          Fire Sensor
        </label>
        <label className="block text-sm font-medium mb-2">
          <input
            type="checkbox"
            value="GasSensor"
            disabled={noSensors}
            checked={selectedSensors.includes("GasSensor")}
            onChange={handleSensorChange}
          />
          Gas Sensor
        </label>
        <label className="block text-sm font-medium mb-2">
          <input
            type="checkbox"
            checked={noSensors}
            onChange={handleNoSensorsChange}
          />
          No Sensors Installed
        </label>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        disabled={selectedSensors.length === 0 && !noSensors}
      >
        Save Sensors
      </button>
    </form>
  );
};

export default SensorSelectionForm;
