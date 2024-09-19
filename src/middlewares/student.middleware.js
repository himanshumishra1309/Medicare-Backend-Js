import { ApiError } from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js";
import {Student} from '../models/student.model.js'

// the request already contains the cookies so we will access the coookies from request and then access the accessToken or refresToken from it
//here we are not using res so we can write this as well ---> (req, _, next)
export const verifyStudentJWT = asyncHandler(async(req, _, next) => {
    try {
        // console.log("accesstoken-verifyjwt: ", req.cookies?.accessToken);
        const token = req.cookies?.studentAccessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await Student.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})