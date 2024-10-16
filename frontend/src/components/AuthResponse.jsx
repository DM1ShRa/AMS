import React, { useState } from "react";
import { toast } from "react-hot-toast";

const AuthResponse = ({ userLocation, accidentType }) => {
  const [predictedAuthority, setPredictedAuthority] = useState(null);
  const [error, setError] = useState(null);

  const predictAuthority = async () => {
    try {
      const response = await fetch("http://localhost:5000/predict_authority", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: userLocation,
          accident_type: accidentType,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setPredictedAuthority(data.predicted_authority);
      toast.success(
        `Predicted fastest responding authority: ${data.predicted_authority}`
      );
    } catch (err) {
      setError("Error predicting authority");
      toast.error("Error predicting authority");
      console.error(err);
    }
  };

  return (
    <div className="py-12 px-6 mx-auto max-w-screen-xl">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md mt-4">
        <h2 className="text-lg font-bold mb-2">
          Authority Response Prediction
        </h2>
        <button
          onClick={predictAuthority}
          className="bg-slate-500 text-white px-4 py-2 rounded-lg"
        >
          Predict Fastest Responding Authority
        </button>
        {predictedAuthority && (
          <div className="mt-4">
            <p className="text-lg">
              Fastest Responding Authority: {predictedAuthority}
            </p>
          </div>
        )}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default AuthResponse;
