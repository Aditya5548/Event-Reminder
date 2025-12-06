import cors from 'cors'
import express from "express";
import jwt from "jsonwebtoken"; // for authentication
import bcrypt from "bcrypt"; //for encrypting the password
import 'dotenv/config';
import formidable from 'formidable';
import multer from 'multer';
import fs from 'fs';
import { connectdb } from '../src/config/db.js'
import eventModel from '../models/eventModel.js'


connectdb();
const eventRoute = express()
eventRoute.use(express.urlencoded({ extended: true }));
eventRoute.use(cors())



const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/upload')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const upload = multer({ storage })


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
      image: req.file ? req.file.filename : null
    });
    await newEvent.save();

    return res.json({ success: true, msg: "Event added successfully" });
  }
  catch (error) {
    return res.json({ success: false, msg: "Error occurred" });
  }

});

eventRoute.delete('/eventdelete/:id', async (req, res) => {
  const response =await eventModel.findById(req.params.id)
  if(response){
    fs.unlinkSync(`./public/upload/${response.image}`);
    const deleted= await eventModel.findByIdAndDelete(response._id)
    return res.json({ "success":true}); 
  }
  else{
    return res.json({ "success":false, msg:"No Data Found"});
  } 
})

eventRoute.patch('/eventupdate', async (req, res) => {
  const response =await eventModel.findById(req.body.id)
  if(req.body.actiontype==="changestatus" && response){
    await eventModel.findByIdAndUpdate(response._id,{$set:{status:"Completed"}})
    return res.json({ "success":true}); 
  }
    if(req.body.actiontype==="updatevent" && response){
    await eventModel.findByIdAndUpdate(response._id,{$set:req.body})
    return res.json({ "success":true}); 
  }
  else{
    return res.json({ "success":false, msg:"No Data Found"});
  } 
})

export default eventRoute;