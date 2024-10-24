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
  const Spinner = () => (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-500"></div>
    </div>
  );

  if (!isLoaded) {
    return <Spinner />;
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
