import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import Navbar from "./components/navbar";
import AppRoutes from "./routes/routes";

function App() {
  return (
    <Router>
      <Navbar />
      <AppRoutes />
      <SignedIn>
        <UserButton />
      </SignedIn>
    </Router>
  );
}

export default App;
