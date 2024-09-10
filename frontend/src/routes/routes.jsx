// src/routes/Routes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../components/home";
import Sensors from "../components/sensors";
import About from "../components/about";
import { SignIn } from "@clerk/clerk-react";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sensors" element={<Sensors />} />
      <Route path="/about" element={<About />} />
      <Route path="/sign-in/*" element={<SignIn />} />
    </Routes>
  );
};

export default AppRoutes;
