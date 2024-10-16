import React, { useState } from "react";

const AuthResponse = ({ userLocation, accidentType }) => {
  const [predictedAuthority, setPredictedAuthority] = useState(null);
  const [error, setError] = useState(null);

  const randomAuthorities = [
    "Fire Department",
    "Police Department",
    "Municipal Authority Ambulance",
  ];

  const predictAuthority = () => {
    try {
      // Simulate a delay to mimic an API call
      setTimeout(() => {
        // Randomly select an authority from the array
        const randomIndex = Math.floor(Math.random() * randomAuthorities.length);
        setPredictedAuthority(randomAuthorities[randomIndex]);
      }, 1000); // 1-second delay for simulation
    } catch (err) {
      setError("Error simulating prediction");
    }
  };

  return (
    <div className="py-12 px-6 mx-auto max-w-screen-xl">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md mt-4">
        <h2 className="text-lg font-bold mb-2">Authority Response Prediction</h2>
        <button
          onClick={predictAuthority}
          className="bg-slate-500 text-white px-4 py-2 rounded-lg"
        >
          Predict Fastest Responding Authority
        </button>
        {predictedAuthority && (
          <div className="mt-4">
            <p className="text-lg">Fastest Responding Authority: {predictedAuthority}</p>
          </div>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default AuthResponse;
