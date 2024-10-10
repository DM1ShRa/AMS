import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase/firebaseConfig";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
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

  const Spinner = () => (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-400"></div>
    </div>
  );

  if (!isLoaded) {
    return <Spinner />;
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

  const closeAlert = async (alertId) => {
    try {
      const alertRef = doc(db, "alerts", alertId);
      await updateDoc(alertRef, {
        isClosed: true, 
      });
      console.log(`Alert with ID: ${alertId} marked as closed.`);
    } catch (e) {
      console.error("Error closing alert:", e);
    }
  };

  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-12 px-6">
        <div className="grid py-8 px-4 mx-auto max-w-screen-xl lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="place-self-center mr-auto lg:col-span-7">
            <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none md:text-5xl xl:text-6xl dark:text-white">
              Authority Dashboard
            </h1>
            <p className="mb-6 max-w-2xl font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              Real-time monitoring and alert response for emergency incidents across the region.
            </p>
            <a
              href="#alerts"
              className="inline-flex justify-center items-center py-3 px-5 mr-3 text-base font-medium text-center text-black rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
            >
              View Alerts
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
          <div className="hidden lg:mt-10 lg:col-span-5  lg:flex">
              <img src="https://earthquake.ca.gov/wp-content/uploads/sites/8/2020/09/android_alerts.gif" alt="mockup" className="rounded-lg" />
            </div>
        </div>

        <div className="py-12 px-6 mx-auto max-w-screen-xl" id="alerts">
          <h2 className="text-3xl font-extrabold mb-6">Recent Alerts</h2>
          <ul className="grid gap-6 lg:grid-cols-2">
            {alerts
              .filter((alert) => !alert.isClosed)
              .map((alert) => (
                <li
                  key={alert.id}
                  className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
                >
                  <h3 className="text-lg font-bold">{alert.message}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(alert.timestamp.seconds * 1000).toString()}
                  </p>
                  <strong>User Name:</strong> {alert.userName} <br />
                  <strong>User Email:</strong> {alert.userEmail}
                  <br />
                  <button
                    className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                    onClick={() => closeAlert(alert.id)}
                  >
                    Close Alert
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <div className="py-12 px-6 mx-auto max-w-screen-xl">
          <h2 className="text-3xl font-extrabold mb-6">Incident Locations</h2>
          <MapContainer
            center={[19.035, 73.021]}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {alerts
              .filter((alert) => !alert.isClosed) 
              .map((alert) => {
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

        <footer className="bg-gray-900 text-white py-6 mt-12">
          <div className="container mx-auto text-center">
            <p className="text-sm">
              © 2024 RakshaNetra. All rights reserved. |
              <a href="#" className="text-primary-400 hover:text-primary-300">
                Privacy Policy
              </a>{" "}
              |{" "}
              <a href="#" className="text-primary-400 hover:text-primary-300">
                Terms of Service
              </a>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Authority;
