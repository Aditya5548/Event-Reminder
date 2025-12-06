import express from "express";
import admin from "../src/config/firebase.js";

const router = express.Router();

router.post("/send-web-push-notification", async (req, res) => {
  try {
    const { token, message } = req.body;

    if (!token) return res.status(400).json({ error: "Missing FCM token" });

    const payload = {
      notification: {
        title: "Event-Reminder Platform",
        body: message,
      },
    };

    const response = await admin.messaging().send({
      token,
      ...payload,
    });

    return res.status(200).json({ success: true, msg: "Notification sent!", data: response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, msg: "Error sending notification", error: error.message });
  }
});

export default router;
