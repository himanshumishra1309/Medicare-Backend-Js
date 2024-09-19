import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

//DB is in another continent

const connectDB = async () =>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection error: ", error);
        process.exit(1)
        //NodeJs provides the reference of a process, and this process is the part where the program is running, so process.exit means to exit that program and also after exit there can be various numbers which can fill the brackets and each number represents something else, exit is a method
    }
}

export default connectDB;