import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../components/home";
import About from "../components/about";
import Sensors from "../components/sensors";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sensors" element={<Sensors />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default AppRoutes;
