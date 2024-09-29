import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../components/home";
import Sensors from "../components/sensors";
import About from "../components/about";
import SensorDetails from "../components/sensorDetails";
import { SignIn } from "@clerk/clerk-react";
import ProtectedRoute from "../components/ProtectedRoute";
import Authority from "../components/Authority";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const AppRoutes = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      const role = user?.publicMetadata?.role;
      if (role === "authority") {
        navigate("/authority");
      }
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
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
      <Route path="/authority" element={<Authority />} />
    </Routes>
  );
};

export default AppRoutes;
