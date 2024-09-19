import { ApiError } from '../utils/ApiErrors.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import {Doctor} from '../models/doctor.model.js'
import {ApiResponse} from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';

// function to return refreshToken and accessToken
const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await Doctor.findById(userId) // this line finds the user from the data base and stores it in the user variable
        const accessToken = user.generateAccessToken() // now this is used to generate access Token
        const refreshToken = user.generateRefreshToken() // now this is used to store the generated refresh Token in the refresh token part of user.model.js file, where we are not taking the refresh token from the user rather we are making a refresh token of our own and saving it in the refresh token part
        //both of those token are taken from the user.model.js file

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }); // this is inbuilt in mongoDB to save the info, but there is one problem with this thing and that it will invoke the password field and to stop that we put an object and make it false the thing that we put in the object is validateBeforeSave

        return {refreshToken, accessToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}


//always remember ki database is in another continent and while talking to database always use await
const registerUser = asyncHandler(async (req,res) => {
    //steps:
    // 1] Get user details from frontend
    // 2] Validation, check if everything is according to the standard way of how it should be
    // 3] Check if user already exists : name or email
    // 4] In the database we are taking 2 info from the user that is the avatar and cover image, so we have to check this as well whether the user has sent the files or not
    // 5] upload them to cloudinary and also check if the avatar is successfully uploaded on cloudinary or not
    // 6] Create user object ---> create entry in database
    // 7] remove password and refresh token field from response, i.e dont send the password and the refresh token to the user as response
    // 8] Check for user creation, i.e check whether the user is created or not
    // 9] return the response to the user

    const {name, email, qualification, experience, password} = req.body;
    console.log('email: ', email);
    console.log('req.body: ', req.body);

    // if(fullName === ""){
    //     throw new ApiError(400, "fullname is required")
    // }
    // this is a beginner syntax code, rather a better way of implementing this is written below


    //what we did here is we we made different field and then made 'some' call on it and if any field is empty it will return true and then the code will return a error
    if([email, name, password, qualification, experience].some((field) => field?.trim() === "")){
        throw new ApiError(400, "Every detail is required");
    }

    //User is directly connect to the mongoose model and it has a method named as 'findOne' and in this we are check for two fields and therefor we used '$or' and then we made an array and in whichever field we want to check, we need to put all those in different objects
    const existedUser = await Doctor.findOne({email})

    if(existedUser){
        throw new ApiError(409, "User with email already exists")
    }

    const user = await Doctor.create({
        name: name,
        email,
        qualification, 
        experience,
        password
    })

    const createdUser = await Doctor.findById(user._id).select("-password -refreshToken") // everytime there is a insertion of a info in the database, mongoDB automatically creates a '_id' of that method and that is exactly what we are finding here by doing user._id, this searches whether the user has been created or not, also we are using select method that is we wrote a select method and then in bracket we wrote what all we dont want to select that is password and refreshToken, and the above written way is the syntax

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    }

    return res
    .status(201)
    .cookie("doctorAccessToken", accessToken, options)
    .cookie("doctorRefreshToken", refreshToken, options)
    .json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )
}) //worked on postman
//note: dont upload the previous file kept in postman to check you application, that gives internal server error, fix that if possible

const loginUser = asyncHandler(async(req, res)=>{
    //Todos:
    //1] Get data from req.body
    //2] give either name or email based entry
    //3] Find the user
    //4] Check the password
    //5] Generate access and refresh token and share it to the user
    //6] Send the token in the form of tokens
    //7] Send the response

    console.log("request : ", req);
    console.log("request's body : ", req.body);
    const {email, password} = req.body;

    //this logic is to check if the name or the email is correct, we cant write it this way : !name || !email
    if(!email){
        throw new ApiError (400, "email is required")
    }

    //this is used to find anyone from the database, by checking the name or email, whichever matches will return
    const user = await Doctor.findOne({email})

    //if we didnot get anything then return that user DNE
    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    // we are not using 'User' rather we will use 'user' which is returned above, because 'User' is an instance of the moongoose of mongoDB and user is the data returned from the data base which signifies a single user and user.models.js file contain all the methods which can be accessed here such as isPasswordCorrect or refreshToken or accessToken
    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Password is incorrect")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await Doctor.findById(user._id).select("-password -refreshToken")

    //now we will be adding functionality to return cookies, and for doing that securely such that the frontend could access those cookies but cannot modify them and also the cookies can only be modified using the backend server
    const options = {
      httpOnly: true,
      secure: true,
    }

    // cookie("accessToken", accessToken, options) this is the way of generating 
    return res
    .status(200)
    .cookie("doctorAccessToken", accessToken, options)
    .cookie("doctorRefreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User Logged In Successfully"
        )
    )

}) //worked on postman


// First thing that should come in our mind hearing about logout is, first we have to clear the cookies of the user and also remove the access and refresh token from the user
const logoutUser = asyncHandler(async(req, res)=>{
  Doctor.findByIdAndUpdate(
    req.user._id,
    // {
    //   refreshToken: undefined
    // }, dont use this approach, this dosent work well

    {
      $unset:{
        refreshToken: 1 // this removes the field from the document
      }
    },
    {
      new: true
    }
  )
  
  const options = {
    httpOnly: true,
    secure: true
  }
  
  return res.status(200).clearCookie("doctorAccessToken", options).clearCookie("doctorRefreshToken", options).json(new ApiResponse(200, {}, "User logged out"))
}) // worked on postman


const refreshAccessToken = asyncHandler(async (req, res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await Doctor.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "Invalid Refresh Token")
        }
    
        if(incomingRefreshToken !== user){
            throw new ApiError(401, "Refresh Token Expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true,
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id);
    
        return res.status(200).cookie("doctorAccessToken", accessToken, options).cookie("doctorRefreshToken", newRefreshToken, options)
        .json(new ApiResponse(
            200,
            {
                accessToken,
                refreshToken: newRefreshToken,
            },
            "Access Token Refreshed"
        ))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")
    }

}) //not working on postman


const changeCurrentPassword = asyncHandler(async (req, res)=>{
  const {oldPassword, newPassword} = req.body

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await User.isPasswordCorrect(oldPassword) // const isPasswordCorrect is a variable where as the User.isPasswordCorrect is from user models

  if(!isPasswordCorrect){
    throw new ApiError(400, "Invalid old Password")
  }

  user.password = newPassword
  await user.save({validateBeforeSave: false});

  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Password changed successfully"))
}) 

const getCurrentUser = asyncHandler(async (req, res)=>{
  return res.status(200).json(new ApiResponse(200, req.user, "current user fetched successfully"))
})//worked on postman

const updateAccountDetails = asyncHandler(async (req, res)=>{
  console.log("req.body of update account details: ",req.body);
  const {name, email, qualification, experience} = req.body;

  if(!name || !email || !qualification || !experience){
    throw new ApiError(400, "All field are requires")
  }

  const user = await Doctor.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        name,//we can write fullName: fullName or directly fullName as well
        email: email,
        qualification, 
        experience
      }
    },
    {new: true} // this returns all the values after the fields are updated
  ).select("-password")

  return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"))
}) //no response from postman


export {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails}

// console.log(createdUser);

{/*

    {
        _id: new ObjectId('66cd91730dced06f0d8c961c'),
        name: 'm',
        email: 'mishra@gmail.com',
        fullName: 'Mishra',
        avatar: 'http://res.cloudinary.com/dekefmvkz/image/upload/v1724748146/ujqq9fighs7qcswkxzaq.jpg',
        coverImage: 'http://res.cloudinary.com/dekefmvkz/image/upload/v1724748147/hcpvkwzhlad6qndxcwqq.jpg',
        watchHistory: [],
        createdAt: 2024-08-27T08:42:27.442Z,
        updatedAt: 2024-08-27T08:42:27.442Z,
        __v: 0
    }
    
*/}
