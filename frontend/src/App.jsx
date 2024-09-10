// src/App.js
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Navbar from "./components/navbar";
import AppRoutes from "./routes/routes";

function App() {
  return (
    <Router>
      <Navbar />
      <SignedIn>
        <AppRoutes />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </Router>
  );
}

export default App;
