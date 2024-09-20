import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser' // used to keep the cookies in the users part itself which can be accessed by the server only

const app = express()

//we will use app.use() when we want to use any middleware or any configuration setting
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
// this is a way of accepting the json responses, at a limit of 16kb
app.use(express.urlencoded({extended:true, limit: "16kb"}))
// getting info from the url is difficult sometime if we search "himanshu mishra" on google, in it's url it will have "himanshu+mishra" and in some url ther use "%20" to represent a space, so to avoid the confusion and the problems of getting data from the url we use urlencoded
app.use(express.static("public"));
//this is used to store the public assets in the server, public is the name of the folder
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Server is running!');
});

//importing routes
import studentRouter from './routes/student.routes.js'
import doctorRouter from './routes/doctor.routes.js'

//routes declaration    
app.use('/api/v1/students', studentRouter)
app.use('/api/v1/doctors', doctorRouter)
//when the user writes /api/v1/user it will be routed to /register

// the url will be something like this: http://localhost:8000/api/v1/users/registers

export {app}

{/*
    MIDDLEWARE:
    
    suppose there are 3 blocks, block1, block2, block3

    in block1 suppose there is a request of '/instagram' form the user and the block3 has 4 properties in order to answer the request (err, req, res, next),  next is nothing but a flag which are passed by the middlewares that is the things inside the block2, they set the next flag as soon they get finished, the request reaches the block3 and gives the response back only when the request passes throught the middle ware, and that is the use of the use of the middle ware.

*/}