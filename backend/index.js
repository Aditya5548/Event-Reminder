import express  from "express";
import cors from "cors";
import { connectdb } from "./src/config/db.js";
import {autorun} from './autorun.js';
import admin from './src/config/firebase.js'
import userRoute from './routes/userRoute.js';
import eventRoute from "./routes/eventRoute.js";
import webPushRoute from "./routes/webPushRoute.js";

const port= process.env.PORT || 4000
connectdb();
autorun();

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use('/public', express.static('public'));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

app.get("/",(req,res)=>{
    res.send("Api Working for the Event Reminder App")
})


app.use(userRoute)
app.use(eventRoute)
app.use(webPushRoute)

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})