import React from "react";
import { db } from "../Firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { useUser } from "@clerk/clerk-react";

const ModalComponent = ({ show, handleClose, children }) => {
  const { user } = useUser();

  const handleAlert = async () => {
    const alertData = {
      message: "Alert generated!",
      timestamp: new Date(),
      userName: user?.firstName || "Unknown User",
      userEmail: user?.emailAddresses[0]?.emailAddress || "Unknown Email",
    };

    try {
      const docRef = await addDoc(collection(db, "alerts"), alertData);
      console.log("Alert added with ID:", docRef.id);
    } catch (e) {
      console.error("Error adding alert:", e);
    }
  };
  if (!show) return null;

  return (
    <div className="modal-backdrop fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-content bg-white p-6 rounded-md shadow-lg">
        <button className="modal-close float-right" onClick={handleClose}>
          ✖
        </button>
        <div className="modal-body">{children}</div>,
        <div className="mt-4">
          <button
            onClick={handleAlert}
            className="rounded-md bg-red-600 text-white py-2 px-4"
          >
            Trigger Alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
