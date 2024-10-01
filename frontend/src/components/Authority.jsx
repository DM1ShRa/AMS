import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { checkRole } from "../utils/roles";
import { useUser } from "@clerk/clerk-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

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
      <MapContainer
        center={[19.035, 73.021]}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {alerts.map((alert) => {
          if (alert.location?.latitude && alert.location?.longitude) {
            return (
              <Marker
                key={alert.id}
                position={[alert.location.latitude, alert.location.longitude]}
              >
                <Popup>
                  <strong>{alert.userName}</strong>
                  <br />
                  {alert.userEmail}
                  <br />
                  {alert.message}
                  <br />
                  {new Date(alert.timestamp.seconds * 1000).toString()}
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default Authority;
