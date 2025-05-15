import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export default function userMiddleware(req : Request, res : Response, next: NextFunction){
    const header = req.headers["authorization"];
    const decoded = jwt.verify(header as string, process.env.JWT_SECRET!);
    if(decoded){
        if(typeof decoded === "string"){
            res.status(403).json({
                message : "user is not signedin"
            })
            return;
        }
        //@ts-ignore
        req.userId = decoded.id;
        next()
    }else{
        res.status(403).json({
            message : "user is not authenticated"
        })
    }
}