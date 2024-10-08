import React from "react";
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
import { Skeleton } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { CircularProgress } from "@mui/material";

const fetcher = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "Sensor 1",
        readings: [
          { timestamp: Date.now() - 60000, value: Math.random() * 100 },
          { timestamp: Date.now() - 45000, value: Math.random() * 100 },
          { timestamp: Date.now() - 30000, value: Math.random() * 100 },
          { timestamp: Date.now() - 15000, value: Math.random() * 100 },
        ],
      });
    }, 1000);
  });
};

const SensorDetailsWithSWR = () => {
  const { data, error } = useSWR("/api/sensor", fetcher, {
    refreshInterval: 3000,
  });

  if (error) return <Box sx={{ color: 'error.main' }}>Error loading sensor data</Box>;
  if (!data) return <CircularProgress color="primary" />;

  const readings = data.readings.map((reading) => ({
    time: new Date(reading.timestamp).toLocaleTimeString(),
    value: reading.value,
  }));

  return (
    <Box sx={{ padding: 4, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: "center", color: "gray" }}>
        <div className="font-bold">
        Live Sensor Readings for {data.name}
        </div>
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={readings} margin={{ top: 20, right: 1, left: 1, bottom: 10 }}>
          <CartesianGrid strokeDasharray="1 1" stroke="#e0e0e0" />
          <XAxis dataKey="time" tick={{ fill: "#757575" }} />
          <YAxis tick={{ fill: "#757575" }} />
          <Tooltip contentStyle={{ backgroundColor: "#f5f5f5", border: "none" }} />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3f51b5"
            strokeWidth={1}
            dot={{ fill: "#3f51b5", r: 3 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default SensorDetailsWithSWR;
