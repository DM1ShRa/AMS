import React, { useEffect, useState } from "react";
import { FaTools, FaCheckCircle, FaExclamationCircle, FaWrench } from "react-icons/fa";

// Mock function to simulate predictive maintenance calculation
const calculatePredictions = (sensors) => {
  const predictions = sensors.map((sensor) => {
    const nextMaintenanceDate = new Date(
      Date.now() + Math.random() * 10000000000
    );
    const severityLevel = Math.floor(Math.random() * 3) + 1; // Random severity between 1 and 3
    return {
      sensorName: sensor,
      nextMaintenance: nextMaintenanceDate.toDateString(),
      severity: severityLevel,
    };
  });
  return predictions;
};

// Icon and color mapping based on severity level
const getSeverityIcon = (severity) => {
  switch (severity) {
    case 1:
      return <FaCheckCircle className="text-green-500" size={24} />;
    case 2:
      return <FaExclamationCircle className="text-yellow-500" size={24} />;
    case 3:
      return <FaWrench className="text-red-500" size={24} />;
    default:
      return <FaTools />;
  }
};

const MLAnalysis = ({ userSensors }) => {
  const [predictions, setPredictions] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    if (userSensors.length > 0) {
      const predictionResults = calculatePredictions(userSensors);
      setPredictions(predictionResults);
    }
  }, [userSensors]);

  const handleViewDetails = (sensorName) => {
    setToast({ show: true, message: `Details for ${sensorName}` });

    // Hide the toast after 3 seconds
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  if (userSensors.length === 0) {
    return null; // No sensors to analyze
  }

  return (
    <div className="py-12 px-6 mx-auto max-w-screen-xl">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Predictive Maintenance Analysis
      </h2>
      
      <div className="grid gap-6 lg:grid-cols-3">
        {predictions.map((prediction, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold dark:text-white mb-4">
                {prediction.sensorName} Maintenance
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Next maintenance predicted on:{" "}
                <span className="font-bold text-gray-900 dark:text-white">
                  {prediction.nextMaintenance}
                </span>
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              {/* Displaying the severity level with color and icon */}
              <span className="text-lg font-bold dark:text-white">
                Severity: {getSeverityIcon(prediction.severity)}
              </span>
              <button
                className="text-primary-700 dark:text-primary-400 underline hover:text-primary-900"
                onClick={() => handleViewDetails(prediction.sensorName)}
              >
                View Details
              </button>
            </div>
            {/* Collapsible section for additional details */}
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last Maintenance: {new Date(Date.now() - Math.random() * 10000000000).toDateString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Status: {prediction.severity === 3 ? "Critical" : "Good Condition"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-5 right-5 bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out">
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default MLAnalysis;
