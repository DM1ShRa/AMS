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
    <div className="feedback-form p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold">We value your feedback</h2>
      <p className="text-gray-700 dark:text-gray-400">
        Your Alert has been resolved. Please provide your feedback
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 border rounded"
          rows="4"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Provide your feedback on the incident..."
        ></textarea>
        <button
          type="submit"
          className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
