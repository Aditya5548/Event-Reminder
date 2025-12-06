import cors from 'cors'
import express from "express";
import jwt from "jsonwebtoken"; // for authentication
import 'dotenv/config';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { connectdb } from '../src/config/db.js';
import eventModel from '../models/eventModel.js';


connectdb();
const eventRoute = express()
eventRoute.use(express.urlencoded({ extended: true }));
eventRoute.use(cors())

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'event-reminder',
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => Date.now() + '-' + file.originalname,
  }
});
const upload = multer({ storage, limits: { filesize: 2 * 1024 * 1024 } })
eventRoute.get('/eventfind', async (req, res) => {
  try {
    const { userid, date } = req.query;
    const decoded = jwt.decode(userid)
    const events = await eventModel.find({ userid: decoded.id, date: date })
    return res.send({ success: true, data: events })
  }
  catch (e) {
    return res.json({ success: false, msg: "illegal Entry" })
  }
})


eventRoute.post("/eventadd", upload.single("eventimage"), async (req, res) => {
  try {
    const { eventname, description, date, starttime, endtime, userid, fcmtoken } = req.body;
    const decoded = jwt.decode(userid)
    const newEvent = new eventModel({
      eventname,
      description,
      date,
      starttime,
      endtime,
      fcmtoken,
      userid: decoded.id,
      status: "Upcoming",
      image: req.file.filename,
      imageurl: req.file.path
    });
    await newEvent.save();

    return res.json({ success: true, msg: "Event added successfully" });
  }
  catch (error) {
    return res.json({ success: false, msg: "Error occurred" });
  }

});

eventRoute.delete('/eventdelete/:id', async (req, res) => {
  try {

    const response = await eventModel.findById(req.params.id)
    if (response) {
      const publicId = response.image
      await cloudinary.uploader.destroy(publicId, { resource_type: "image", });
      await eventModel.findByIdAndDelete(response._id)
      return res.json({ "success": true });
    }
    else {
      return res.json({ "success": false, msg: "No Data Found" });
    }
  }
  catch (error) {
    return res.json({ "success": false, msg: "Error Occurred" });
  }
})



eventRoute.patch('/eventupdate', async (req, res) => {
  const response = await eventModel.findById(req.body.id)
  if (req.body.actiontype === "changestatus" && response) {
    await eventModel.findByIdAndUpdate(response._id, { $set: { status: "Completed" } })
    return res.json({ "success": true });
  }
  if (req.body.actiontype === "updatevent" && response) {
    await eventModel.findByIdAndUpdate(response._id, { $set: req.body })
    return res.json({ "success": true });
  }
  else {
    return res.json({ "success": false, msg: "No Data Found" });
  }
})

export default eventRoute;