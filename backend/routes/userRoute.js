import cors from 'cors'
import express from "express";
import jwt from "jsonwebtoken"; // for authentication
import bcrypt from "bcrypt"; //for encrypting the password
import 'dotenv/config';

import { connectdb } from '../src/config/db.js'
import userModel from '../models/userModel.js'

const userRoute = express()
userRoute.use(express.json())
userRoute.use(cors())

connectdb();

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

userRoute.get('/userlogin', async (req, res) => {
    if (req.query.email && req.query.password) {
        const { email, password } = req.query
        if (email && password) {
            const user = await userModel.findOne({ email: email })
            if (!user) {
                return res.status(200).json({ success: false, msg: "user not exists" });
            }
            else {
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) {
                    return res.status(200).json({ success: false, msg: "incorrect password" });
                }
                else {
                    const token = createToken(user._id)
                    return res.status(200).json({ success: true, msg: "Login Successfull", usertoken: token, username: user.name });
                }

            }
        }
        else {
            return res.status(200).json({ success: false, msg: "error occurred" });
        }
    }
})


userRoute.get('/getnamebytoken', async (req, res) => {
    const decoded = jwt.verify(req.query.token, process.env.JWT_SECRET)
    const user = await userModel.findById(decoded.id)
    return res.status(200).json({ success: true, username: user.name });
})


userRoute.post('/userreg', async (req, res) => {
    if (req.body.authtype === "registration") {
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(req.body.password, salt)
        try {
            if (req.body.email) {
                const data = {
                    name: req.body.name,
                    dob: req.body.dob,
                    gender: req.body.gender,
                    email: req.body.email,
                    phoneno: req.body.phoneno,
                    password: hashedpassword,
                    authtype: authtype
                }
                const newuser = new userModel(data)
                const userreturn = await newuser.save()
                const token = createToken(userreturn._id)
                return res.status(200).json({ success: true, usertoken: token, username: userreturn.name });
            }
            else {
                return res.status(200).json({ success: false, msg: "All Field required" });
            }
        } catch (error) {
            return res.status(200).json({ success: false, msg: "Already registered" });
        }
    }
    else if (req.body.authtype === "google") {
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) {
            const token = createToken(existingUser._id)
            return res.status(200).json({ success: true, usertoken: token, username: existingUser.name });
        }
        else {
            const newuser = new userModel(req.body)
            const newuserreturn = await newuser.save()
            const token = createToken(newuserreturn._id)
            return res.status(200).json({ success: true, usertoken: token, username: newuserreturn.name });
        }
    }
})


export default userRoute;