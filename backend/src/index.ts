import express from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import cors from "cors"
import bcrypt from "bcrypt"
import { UserModel } from "./db";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.post("/signup" , async(req, res)=>{
    const { username, password} = req.body;
    const hashedPassword = bcrypt.hash(password,10);
    try{
        const user = await UserModel.create({
            username,
            hashedPassword
        })
        res.json({
            message : "user signed up"
        })
    }catch(error){
        res.status(403).json({
            message : "user already exist"
        })
    }
})

app.post("/signin", async(req, res)=>{
    const { username, password} = req.body;
    try{
        const user = await UserModel.findOne({
            where : {
                username,
                password
            }
        })
        if(!user){
            res.status(403).json({
                message : "User not found please signup first"
            })
        }
        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign({
            id : user?._id
        }, jwtSecret!)
    }catch(error){
        res.status(411).json({
            message : "incorrect credentials"
        })
    }
})

app.post("/content",(req, res)=>{

})

app.get("/content", (req, res)=>{

})

app.delete("content",(req, res)=>{

})

app.post("/share", (req, res)=>{

})

app.get("/:share", (req, res)=>{

})  

app.listen(3000);