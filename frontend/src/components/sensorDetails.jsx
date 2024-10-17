import React, { useState, useEffect } from "react";
import useSWR from "swr";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Box, Typography, CircularProgress } from "@mui/material";
import { dbFirestore, dbRealtime } from "../Firebase/firebaseConfig";
import { ref, onValue, update } from "firebase/database";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-hot-toast"; // Notification system
// Ensure you import toast

const fetcher = (sensorId, thresholds) => {
  return new Promise((resolve, reject) => {
    const sensorData = [];
    const sensorsRef = ref(dbRealtime, `/${sensorId}`);

    onValue(sensorsRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const tempValue = data.Temperature;
        const gasValue = data.GasValue;
        const alertTriggered = data.alertTriggered || false; // Get current alert status
        const timestamp = Date.now();

        sensorData.push({
          timestamp,
          temperature: tempValue,
          gas: gasValue,
        });

        // Log the current sensor values and alert status
        console.log(
          `Current Reading - Temperature: ${tempValue}, Gas: ${gasValue}, Alert Triggered: ${alertTriggered}`
        );

        // Flag to determine if an alert is sent
        let alertSent = false;

        // Check if thresholds are exceeded
        if (
          tempValue > thresholds.temperatureThreshold ||
          gasValue > thresholds.gasThreshold
        ) {
          if (!alertTriggered) {
            // Send alert only if it hasn't been triggered
            console.log(`Alert triggered for Sensor ID: ${sensorId}`);
            await addAlert(sensorId, tempValue, gasValue); // Add alert to Firestore
            await updateAlertStatus(sensorId, true); // Set alertTriggered = true in Firebase
            alertSent = true; // Mark alert as sent

            // Show toast notification
            toast.success(
              `Alert triggered for Sensor ID: ${sensorId}. Temperature: ${tempValue}, Gas: ${gasValue}`
            );
          }
        }

        // Reset alertTriggered if values are back to normal
        if (
          tempValue < thresholds.temperatureThreshold &&
          gasValue < thresholds.gasThreshold &&
          alertTriggered
        ) {
          console.log(`Alert reset for Sensor ID: ${sensorId}`);
          await updateAlertStatus(sensorId, false); // Reset the alertTriggered flag
          toast.info(
            `Alert reset for Sensor ID: ${sensorId}. Values are back to normal.`
          );
        }

        // Resolve with sensor data after processing
        resolve(sensorData);
      } else {
        reject(
          new Error("No data available. Please check your Firebase setup.")
        );
      }
    });
  });
};

const addAlert = async (sensorId, tempValue, gasValue) => {
  const alertData = {
    message: `Alert: Temperature: ${tempValue}, Gas: ${gasValue}`,
    timestamp: new Date(),
    sensorId: sensorId,
  };
  try {
    await addDoc(collection(dbFirestore, "alerts"), alertData);
    console.log("Alert added successfully");
  } catch (error) {
    console.error("Error adding alert:", error);
  }
};

const updateAlertStatus = async (sensorId, status) => {
  const sensorsRef = ref(dbRealtime, `/${sensorId}`);
  await update(sensorsRef, { alertTriggered: status });
};

const SensorDetailsWithSWR = ({ sensorId }) => {
  const [sensorReadings, setSensorReadings] = useState([]);

  const { data, error } = useSWR(
    sensorId,
    () => fetcher(sensorId, { temperatureThreshold: 100, gasThreshold: 550 }),
    {
      refreshInterval: 500, // Fetch every 2 seconds
    }
  );

  useEffect(() => {
    if (data) {
      setSensorReadings((prevData) => [...prevData, ...data]);
    }
  }, [data]);

  if (error) {
    console.error("Error fetching sensor data:", error);
    return <Box sx={{ color: "error.main" }}>{error.message}</Box>;
  }

  if (!sensorReadings.length) {
    console.log("Loading sensor data...");
    return <CircularProgress color="primary" />;
  }

  const readings = sensorReadings.map((reading) => ({
    time: new Date(reading.timestamp).toLocaleTimeString(),
    temperature: reading.temperature,
    gas: reading.gas,
  }));

  return (
    <Box
      sx={{
        padding: 4,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textAlign: "center", color: "gray" }}
      >
        <div className="font-bold">
          Live Sensor Readings for {sensorId.replace("_", " ").toUpperCase()}
        </div>
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={readings}
          margin={{ top: 20, right: 1, left: 1, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="1 1" stroke="#e0e0e0" />
          <XAxis dataKey="time" tick={{ fill: "#757575" }} />
          <YAxis tick={{ fill: "#757575" }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#f5f5f5", border: "none" }}
          />
          <Legend verticalAlign="top" height={40} />
          <Line
            type="monotone"
            dataKey="temperature"
            name="Temperature (°C)"
            stroke="#3f51b5"
            strokeWidth={2}
            dot={{ fill: "#3f51b5", r: 3 }}
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="gas"
            name="Gas Value (ppm)"
            stroke="#f44336"
            strokeWidth={2}
            dot={{ fill: "#f44336", r: 3 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SensorDetailsWithSWR;
