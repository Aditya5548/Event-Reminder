import cron from "node-cron";
import axios from "axios";
import eventModel from "./models/eventModel.js";
import userModel from "./models/userModel.js";
import { connectdb } from './src/config/db.js';

import { main } from './Send-Email/helper.js';
export const autorun = async () => cron.schedule("* * * * *", async () => {
  connectdb()
  try {
    const now = new Date();

    // extract current time and date in required format
    const hh = String(now.getHours()).padStart(2, "0");
    const mn = String(now.getMinutes()).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const ms = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const time1 = hh + ":" + mn
    const date1 = yyyy + "-" + ms + "-" + dd

    //  calculate 30 minute later time
    const thirtyMinutesLater = new Date(now.getTime() + 30 * 60000);
    const hour = String(thirtyMinutesLater.getHours()).padStart(2, "0");
    const minute = String(thirtyMinutesLater.getMinutes()).padStart(2, "0");
    const time2 = hour + ":" + minute


    //Find today Upcoming Events
    const UpcomingEvents = await eventModel.find({ date: date1, status: "Upcoming" });

    for (const event of UpcomingEvents) {

      // JOB:1  Update status to RUNNING when current time between start and end
      if (event.starttime <= time1 && event.endtime >= time1 && event.status=="Upcoming") {
        var find_email_id = await userModel.findById({ _id: event.userid })
        const msg = `<b>Hello, ${find_email_id.name}<b/><p>This is the reminder that your event <b>${event.eventname}<b/> is now Started.<p/> Event Date: ${event.date}<br/>Event Time: ${event.starttime} to ${event.endtime} <p>Please Make Sure Completed on time.<p/> <br/> <br>Regards,<br/>Event-Reminder`
        main(find_email_id.email, "Event-Reminder", msg)
        await eventModel.updateMany({ starttime: { $lte: time1 }, endtime: { $gte: time1 }, date: date1, status: { $in: ["Upcoming"] } }, { $set: { status: "Running" } });
      }

      // JOB:2  Update status to MISSED
      if (event.endtime < time1 && event.status=="Upcoming") {
        await eventModel.updateMany({ endtime: { $lt: time1 }, date: date1, status: { $in: ["Upcoming"] } }, { $set: { status: "Missed" } });
      }

      // JOB:3 30 Mintues later occuring events Reminder
      if (event.starttime === time2) {
        if (event.fcmtoken) {
          const message = `Reminder for ${event.eventname} that will Started after 30 minutes`
          await axios.post(`${process.env.BACKEND_URL}/send-web-push-notification`, { token: event.fcmtoken, message: message })
        }
      }
    }
  }
  catch (err) {
    console.error("Cron Error:", err);
  }
});
