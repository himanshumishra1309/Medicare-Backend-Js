import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"; //jwt is a bearer token, this means whoever bears it will recieve the required data and also we can understand it as a key, whoever have the key will get the data 
import bcrypt from 'bcrypt' //bcrypt is used to encrypt the password in the database

const doctorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true, // this makes are searching part ease, its like giving id to everything, and we dont use indexing everywhere it makes the performance of our database bad.
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        qualification: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        experience:{
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        password:{
            type: String,
            required: [true, "Password is required"],
        },
    }
, {timestamps: true})

doctorSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next(); //because of 'pre(save)' method everytime we do any change in any one file in the doctorSchema this hasing part can run, so to prevent hasing part everytime the user changes something and saves, this line checks if there is any change made in the password field and if no then directly return next and no need to hash anything, but if passowrd is changed then exectue the below written line 

    this.password = await bcrypt.hash(this.password, 10) //the format is: (what to hash, number of rounds(put any number here or write default))
    next();
})
//here 'pre' is a hook in the bycrypt part, the above code means just before saving the response, that is pre and save, encrypt the password and we have made the function async because the encryption of the password takes some time, also here we are not using the arrow function because in arrow function we dont get the reference of anything(if you did not get this line, dont worry, just move on and just remember never use arrow function)

{/*

    if(!this.isModified("password")) return next();


    this.isModified("password"):

    This line checks if the password field has been modified before saving the document.
    The isModified() method is provided by Mongoose and checks whether a specific field (in this case, "password") has been modified in the current document.
    This is important because you do not want to re-hash the password if the password hasn't changed. For example, if you're updating other fields in the document (like username or email), the password should not be hashed again.
    
    return next();:
    If the password hasn't been modified, this line immediately calls next() to pass control to the next middleware or the actual save operation. It skips the hashing process.
    
    this.password = await bcrypt.hash(this.password, 10)
    
    
    this.password:

    Refers to the password field of the current document (user).
    this is used to access the properties of the document that is being saved.
    bcrypt.hash(this.password, 10):

    The bcrypt.hash() function hashes the password. It takes two arguments:
    
    The plain text password (i.e., this.password): This is the raw password provided by the user before it is hashed.
    The salt rounds (10 in this case): A salt is a random value added to the password before hashing to increase security. The higher the number of salt rounds, the more secure but also more computationally expensive the hashing process becomes. 10 is a commonly used number of salt rounds for a balance between security and performance.
    
    await:
    Since hashing is an asynchronous operation, we use await to wait for bcrypt.hash() to finish before continuing. Once the password is hashed, the await keyword ensures that the code doesn't proceed to the next line until the password is hashed.
    this.password = ...:

    After hashing, the plain text password (this.password) is replaced with the hashed version. This ensures that only the hashed password gets saved to the database.
    
*/}

//By the below written code we have made our own method to check if the password correct or not
doctorSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password); // this is a function of bycrypt which compares the passowrd entered by the user with the password entered while signing up, also this compare sends true or false value
}

//By the below written code we have made our own method to generate access token
doctorSchema.methods.generateAccessToken = function () {
    //.sign() is a method to generate token
    //syntax: sign(payload: string | Buffer | object, secretOrPrivateKey: null, options?: jwt.SignOptions & { algorithm: "none"; }): string
    return jwt.sign(
        {
            _id: this.id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        }, // this is the payload part
        process.env.ACCESS_TOKEN_SECRET, //this is the access token
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }, //the expiration time goes in the form of a object 
    )
}

//By the below written code we have made our own method to generate refresh token
doctorSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this.id,
        }, // this is the payload part
        process.env.REFRESH_TOKEN_SECRET, //this is the access token
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }, //the expiration time goes in the form of a object 
    )
}

export const Doctor = mongoose.model("Doctor", doctorSchema)