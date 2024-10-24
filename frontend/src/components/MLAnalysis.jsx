import React, { useEffect, useState } from "react";
import {
  FaTools,
  FaCheckCircle,
  FaExclamationCircle,
  FaWrench,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
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

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await fetch("http://localhost:5000/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sensors: userSensors }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setPredictions(data);
      } catch (error) {
        console.error("Error fetching predictions:", error);
      }
    };

    if (userSensors.length > 0) {
      fetchPredictions();
    }
  }, [userSensors]);

  const handleViewDetails = async (sensorName) => {
    try {
      const response = await fetch(
        `http://localhost:5000/details?sensor=${sensorName}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      toast(
        <div>
          <strong>Details for {sensorName}:</strong>
          <br />
          <span>Status: {data.status}</span>
          <br />
          <span>Last Maintenance: {data.last_maintenance}</span>
        </div>
      ),
        {
          duration: 3000,
        };
    } catch (error) {
      console.error("Error fetching details:", error);
      toast.error(`Failed to fetch details for ${sensorName}`),
        {
          duration: 3000,
        };
    }
  };

  if (userSensors.length === 0) {
    return null;
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
                {prediction.sensor_id} Maintenance
              </h3>
              <p className="text-gray-700 dark:text-gray-400">
                Next maintenance predicted on:{" "}
                <span className="font-bold text-gray-900 dark:text-white">
                  {prediction.next_maintenance}
                </span>
              </p>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-bold dark:text-white">
                Severity: {getSeverityIcon(prediction.severity)}
              </span>
              <button
                className="text-primary-700 dark:text-primary-400 underline hover:text-primary-900"
                onClick={() => handleViewDetails(prediction.sensor_id)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MLAnalysis;
