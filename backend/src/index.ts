import express from "express";
import { UserModel } from "./db";

const app = express();
app.use(express.json());

app.post("/signup" , async(req, res)=>{
    const { username, password} = req.body;
    try{
        const user = await UserModel.create({
            username,
            password
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

app.post("signin",(req, res)=>{

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