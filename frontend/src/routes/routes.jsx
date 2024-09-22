import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../components/home";
import Sensors from "../components/sensors";
import About from "../components/about";
import SensorDetails from "../components/sensorDetails";
import { SignIn } from "@clerk/clerk-react";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/sensors"
        element={
          <ProtectedRoute>
            <Sensors />
          </ProtectedRoute>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/sign-in/*" element={<SignIn />} />
      <Route
        path="/sensor/:sensorId"
        element={
          <ProtectedRoute>
            <SensorDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
