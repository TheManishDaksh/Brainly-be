import mongoose, { Schema, model, Mongoose } from "mongoose";

mongoose.connect("");
const userSchema = new Schema({
    username : {type: String, unique: true},
    password : String,
    name : String
})



export const UserModel = model("user", userSchema);