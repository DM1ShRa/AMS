import React, { useState } from "react";
import { dbFirestore } from "../Firebase/firebaseConfig";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { useUser } from "@clerk/clerk-react";

const FeedbackForm = ({ feedbackAlertId, onFeedbackSubmitted }) => {
  const { user } = useUser();
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback) return;

    try {
      const feedbackDoc = doc(dbFirestore, "feedback", feedbackAlertId);

      const docSnapshot = await getDoc(feedbackDoc);

      if (docSnapshot.exists()) {
        await updateDoc(feedbackDoc, {
          userId: user.id,
          feedback,
          timestamp: new Date(),
        });
      } else {
        await setDoc(feedbackDoc, {
          userId: user.id,
          feedback,
          timestamp: new Date(),
        });
      }

      const userDoc = doc(dbFirestore, "users", user.id);
      await updateDoc(userDoc, {
        feedbackPending: false,
        feedbackAlertId: null,
      });

      onFeedbackSubmitted();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  return (
    <div className="flex justify-start items-start p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg mx-auto">
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          We value your feedback
        </h2>
        <p className="text-gray-700 dark:text-gray-400 mt-2">
          Your alert has been resolved. Please provide your feedback.
        </p>
        <p className="text-gray-700 dark:text-gray-400 mt-4 font-semibold">
          Format of Feedback:
        </p>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-400 mt-2">
          <li>Incident Date: </li>
          <li>Incident Time: </li>
          <li>Location: </li>
          <li>Deaths & Injuries: </li>
          <li>Authority: </li>
          <li>Personal Recommendations: </li>
        </ul>
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows="4"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Provide your feedback on the incident..."
          ></textarea>
          <button
            type="submit"
            className="mt-4 py-2 px-5 bg-slate-700 text-white font-medium rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
