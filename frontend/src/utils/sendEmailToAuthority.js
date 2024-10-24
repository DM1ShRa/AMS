import axios from "axios";

const sendEmailToUser = async ({ userEmail, userName, alertDetails }) => {
  try {
    const response = await axios.post("http://localhost:5000/send-email", {
      to: userEmail,
      subject: `Alert Closed: ${alertDetails.message}`,
      body: `Dear ${userName},

An alert regarding the following incident has been closed:
- Incident: ${alertDetails.message}
- Time: ${new Date(alertDetails.timestamp.seconds * 1000).toString()}

Thank you for your attention and cooperation.

Best regards,
RakshaNetra Team`,
      recipient_name: userName, // Pass user's name here
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error sending email to user:", error);
    return { success: false, error };
  }
};

export default sendEmailToUser;
