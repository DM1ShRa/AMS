import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { dbFirestore } from "../Firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { toast, Toaster } from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { Switch } from "@headlessui/react";
import { motion } from "framer-motion";

const sensorOptions = [
  { value: "sensor_1", label: "Sensor_1" },
  { value: "sensor_2", label: "Sensor_2" },
];

const SensorSelectionForm = ({ onSensorsUpdated }) => {
  const { userId } = useAuth();
  const { control, handleSubmit } = useForm();
  const [noSensors, setNoSensors] = useState(false);

  const onSubmit = async (data) => {
    const selectedSensors = data.sensors
      ? data.sensors.map((s) => s.value)
      : [];
    if (userId) {
      try {
        await setDoc(
          doc(dbFirestore, "users", userId),
          {
            Sensors: noSensors ? [] : selectedSensors,
            noSensors: noSensors,
          },
          { merge: true }
        );

        toast.success("Sensors saved successfully!", {
          duration: 3000,
          position: "top-right",
        });

        onSensorsUpdated(noSensors ? [] : selectedSensors);
      } catch (error) {
        console.error("Error saving sensors:", error);
        toast.error("Error saving sensors. Please try again.", {
          duration: 3000,
          position: "top-right",
        });
      }
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-white rounded-lg shadow-lg"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Select Your Installed Sensors
          </h2>

          {/* Sensors Selection */}
          <div className="mb-6">
            <Controller
              name="sensors"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={sensorOptions}
                  isMulti
                  isDisabled={noSensors}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select sensors..."
                />
              )}
            />
          </div>

          {/* No Sensors Toggle */}
          <div className="flex items-center mb-6">
            <Switch.Group>
              <Switch.Label className="mr-4">No Sensors Installed</Switch.Label>
              <Switch
                checked={noSensors}
                onChange={setNoSensors}
                className={`${
                  noSensors ? "bg-red-600" : "bg-gray-200"
                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
              >
                <span
                  className={`${
                    noSensors ? "translate-x-6" : "translate-x-1"
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                />
              </Switch>
            </Switch.Group>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none"
            disabled={noSensors || (!noSensors && !sensorOptions.length)}
          >
            Save Sensors
          </button>
        </form>
      </motion.div>

      <Toaster />
    </>
  );
};

export default SensorSelectionForm;
