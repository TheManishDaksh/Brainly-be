import mongoose, { Schema, model } from "mongoose";
import dotenv from "dotenv"
dotenv.config();

mongoose.connect(process.env.MONGO_URL!);

const userSchema = new Schema({
    username : {type: String, unique: true},
    password : String,
    name : String
})

const contentShema = new Schema({
    title : String,
    link : String,
    text : String,
    type : String,
    tags : [String],
    userId : {type:mongoose.Types.ObjectId, ref:"user", required:true}
})

const linkSchema = new Schema({
    hash : String,
    userId : {type:mongoose.Types.ObjectId, ref:"user", required:true}
})

export const UserModel = model("user", userSchema);
export const contentModel = model("content", contentShema);
export const linkModel = model("link", linkSchema);