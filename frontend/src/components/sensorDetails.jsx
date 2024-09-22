import React from "react";
import useSWR from "swr";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

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
          { timestamp: Date.now(), value: Math.random() * 100 },
        ],
      });
    }, 1000);
  });
};

const SensorDetailsWithSWR = () => {
  const { data, error } = useSWR("/api/sensor", fetcher, {
    refreshInterval: 3000,
  });

  if (error) return <div>Error loading sensor data</div>;
  if (!data) return <div>Loading...</div>;

  const readings = data.readings.map((reading) => ({
    time: new Date(reading.timestamp).toLocaleTimeString(),
    value: reading.value,
  }));

  return (
    <div>
      <h2>Live Sensor Readings for {data.name}</h2>
      <LineChart width={600} height={300} data={readings}>
        <Line type="monotone" dataKey="value" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
};

export default SensorDetailsWithSWR;
