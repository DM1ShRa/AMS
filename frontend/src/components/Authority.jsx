import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { checkRole } from "../utils/roles";
import { useUser } from "@clerk/clerk-react";

const Authority = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();
  const [alerts, setAlerts] = useState([]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn || !checkRole("authority")) {
    console.log("User is not authorized. Redirecting to home...");
    navigate("/");
    return null;
  }
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "alerts"), (snapshot) => {
      const alertData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAlerts(alertData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Authority Dashboard</h1>
      <h2>Alerts:</h2>
      <ul>
        {alerts.map((alert) => (
          <li key={alert.id}>
            {alert.message} - {alert.timestamp.toDate().toString()} <br />
            <strong>User Name:</strong> {alert.userName} <br />
            <strong>User Email:</strong> {alert.userEmail}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Authority;
