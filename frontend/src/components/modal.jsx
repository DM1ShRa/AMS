import React, { useState, useEffect, useRef } from "react";
import { dbFirestore } from "../Firebase/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

const ModalComponent = ({ show, handleClose, children, sensorId }) => {
  const { user } = useUser();
  const [alertSent, setAlertSent] = useState(false);
  const audioRef = useRef(null);
  const [authorities, setAuthorities] = useState([]);

  useEffect(() => {
    const fetchAuthorities = async () => {
      const authoritiesSnapshot = await getDocs(
        collection(dbFirestore, "authorities")
      );
      const authoritiesList = authoritiesSnapshot.docs.map((doc) => doc.data());
      setAuthorities(authoritiesList);
    };

    fetchAuthorities();
  }, []);

  const handleAlert = async () => {
    if (alertSent) {
      toast.error("Alert has already been sent.");
      return;
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const alertData = {
          message: "Alert generated!",
          timestamp: new Date(),
          userName: user?.firstName || "Unknown User",
          userEmail: user?.emailAddresses[0]?.emailAddress || "Unknown Email",
          location: {
            latitude: latitude,
            longitude: longitude,
          },
          sensorId: sensorId,
          userId: user?.id,
        };
        try {
          const docRef = await addDoc(
            collection(dbFirestore, "alerts"),
            alertData
          );
          toast.success("Alert added successfully!");
          console.log("Alert added with ID:", docRef.id);
          setAlertSent(true);
          authorities.forEach(async (authority) => {
            const emailPayload = {
              to: authority.email,
              subject: "Emergency Alert Triggered",
              body: `Dear ${
                authority.authorityType
              }, an emergency alert has been triggered by ${
                user?.firstName || "a user"
              } at location: Latitude ${latitude}, Longitude ${longitude}. Please respond promptly.`,
              recipient_name: authority.name,
            };
            console.log("Sending email to:", authority.email, emailPayload);
            await fetch("http://localhost:5000/send-email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(emailPayload),
            });
          });
          audioRef.current.play();
          toast.success("Emails sent to authorities!");
        } catch (e) {
          toast.error("Error adding alert. Please try again.");
          console.error("Error adding alert:", e);
        }
      });
    } else {
      toast.error("Geolocation is not supported by this browser.");
      console.error("Geolocation is not supported by this browser.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-content bg-white p-6 rounded-md shadow-lg max-w-[90vh] w-full max-h-[90vh] overflow-auto">
        <button
          className="modal-close float-right text-gray-500 hover:text-gray-700 transition duration-300 ease-in-out"
          onClick={handleClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="modal-body">{children}</div>
        <div className="mt-4">
          <button
            onClick={handleAlert}
            className="rounded-md bg-red-600 text-white py-2 px-4"
          >
            Trigger Alert
          </button>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src="/alert-33762.mp3" />
    </div>
  );
};

export default ModalComponent;
