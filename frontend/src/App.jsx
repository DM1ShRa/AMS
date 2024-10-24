import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/navbar";
import AppRoutes from "./routes/routes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="h-full min-h-screen dark:bg-black bg-white dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] relative flex flex-col">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className=" z-20 bg-clip-text  bg-gradient-to-b  py-4">
        <Router>
          <Navbar />
          <AppRoutes />
        </Router>
      </div>
    </div>
  );
}

export default App;
