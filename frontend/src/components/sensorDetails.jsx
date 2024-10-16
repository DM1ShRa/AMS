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
import { dbRealtime } from "../Firebase/firebaseConfig";
import { dbFirestore } from "../Firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useUser } from "@clerk/clerk-react";
import { ref, onValue } from "firebase/database";
import toast from "react-hot-toast";

const TEMP_THRESHOLD = 100;
const GAS_THRESHOLD = 700;

const fetcher = (sensorId) => {
  return new Promise((resolve, reject) => {
    const sensorData = [];
    const sensorsRef = ref(dbRealtime, `/${sensorId}`);

    onValue(sensorsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const tempValue = data.Temperature;
        const gasValue = data.GasValue;
        const timestamp = Date.now();
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
  const { user } = useUser();
  const [sensorReadings, setSensorReadings] = useState([]);
  const [alertTriggered, setAlertTriggered] = useState({
    temperature: false,
    gas: false,
  });

  const { data, error } = useSWR(sensorId, () => fetcher(sensorId), {
    refreshInterval: 2000,
  });

  useEffect(() => {
    if (data) {
      setSensorReadings((prevData) => [...prevData, ...data]);
      checkForThreshold(data);
    }
  }, [data]);

  const handleAlert = async (triggerType, latitude, longitude) => {
    const alertData = {
      message: `Alert triggered due to high ${triggerType}!`,
      timestamp: new Date(),
      userName: user?.firstName || "Unknown User",
      userEmail: user?.emailAddresses[0]?.emailAddress || "Unknown Email",
      sensorId: sensorId,
      userId: user?.id,
      location: {
        latitude: latitude,
        longitude: longitude,
      },
    };

    try {
      await addDoc(collection(dbFirestore, "alerts"), alertData);
      toast.success(`${triggerType} alert added successfully!`);
    } catch (e) {
      toast.error(`Error adding ${triggerType} alert.`);
      console.error("Error adding alert:", e);
    }
  };

  const checkForThreshold = (readings) => {
    readings.forEach((reading) => {
      const { temperature, gas } = reading;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;

          if (temperature > TEMP_THRESHOLD && !alertTriggered.temperature) {
            handleAlert("Temperature", latitude, longitude);
            setAlertTriggered((prev) => ({ ...prev, temperature: true }));
          } else if (temperature <= TEMP_THRESHOLD) {
            setAlertTriggered((prev) => ({ ...prev, temperature: false }));
          }

          if (gas > GAS_THRESHOLD && !alertTriggered.gas) {
            handleAlert("Gas", latitude, longitude);
            setAlertTriggered((prev) => ({ ...prev, gas: true }));
          } else if (gas <= GAS_THRESHOLD) {
            setAlertTriggered((prev) => ({ ...prev, gas: false }));
          }
        });
      }
    });
  };

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
