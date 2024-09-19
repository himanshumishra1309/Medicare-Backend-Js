// require('dotenv').config({path:'./env'}) ----> we can write this but this is disturbing the pattern of import and that does ot really look professional

import dotenv from 'dotenv'
import connectDB from "./db/index.js";
import { app } from './app.js';

dotenv.config({
    path: './env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port: ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MongoDB connection FAILED!!! ", err);
})

/*

1st METHOD OF CONNECTING DATABASE WITH BACKEND

import express from "express";
const app = express();

(async ()=> {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error)=>{
            console.log("ERROR: ", error);
            throw error;
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`App is listening on port: ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("ERROR: ", error);
        throw error;
    }
})()

*/