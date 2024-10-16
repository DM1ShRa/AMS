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
import { dbRealtime } from "../Firebase/firebaseConfig"; // Import your Firebase configuration
import { ref, onValue } from "firebase/database"; // Import Firebase Realtime Database functions

// Fetcher for sensor data based on sensorId
const fetcher = (sensorId) => {
  return new Promise((resolve, reject) => {
    const sensorData = [];
    const sensorsRef = ref(dbRealtime, `/${sensorId}`); // Adjust path based on sensorId

    onValue(sensorsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const tempValue = data.Temperature;
        const gasValue = data.GasValue;
        const timestamp = Date.now(); // Use current timestamp for each reading

        // Push both temperature and gas values with the same timestamp
        sensorData.push({
          timestamp,
          temperature: tempValue,
          gas: gasValue,
        });

        resolve(sensorData);
      } else {
        reject(
          new Error("No data available. Please check your Firebase setup.")
        );
      }
    });
  });
};

const SensorDetailsWithSWR = ({ sensorId }) => {
  const [sensorReadings, setSensorReadings] = useState([]); // Accumulate data in state

  // Use SWR to fetch data every 3 seconds, pass sensorId as key
  const { data, error } = useSWR(sensorId, () => fetcher(sensorId), {
    refreshInterval: 2000,
  });

  useEffect(() => {
    if (data) {
      // Append the new data to the existing state
      setSensorReadings((prevData) => [...prevData, ...data]);
    }
  }, [data]);

  if (error) {
    console.error("Error fetching sensor data:", error); // Log error if it occurs
    return <Box sx={{ color: "error.main" }}>{error.message}</Box>;
  }

  if (!sensorReadings.length) {
    console.log("Loading sensor data..."); // Log when data is loading
    return <CircularProgress color="primary" />;
  }

  // Prepare data for chart
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

          {/* Line for Temperature */}
          <Line
            type="monotone"
            dataKey="temperature"
            name="Temperature (°C)" // Label for tooltip and legend
            stroke="#3f51b5"
            strokeWidth={2} // Thicker line for better visibility
            dot={{ fill: "#3f51b5", r: 3 }}
            activeDot={{ r: 8 }}
          />

          {/* Line for Gas Value */}
          <Line
            type="monotone"
            dataKey="gas"
            name="Gas Value (ppm)" // Label for tooltip and legend
            stroke="#f44336" // Different color for gas
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
