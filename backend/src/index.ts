import express from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import cors from "cors"
import bcrypt from "bcrypt"
import { contentModel, linkModel, UserModel } from "./db";
import userMiddleware from "./middleware";
import hashGenerator from "./hashGenerator";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.post("/signup", async (req, res) => {
    const { username, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    try {
        await UserModel.create({
            name,
            username,
            password: hashedPassword
        })
        res.json({
            message: "user signed up"
        })
    } catch (error) {
        res.status(403).json({
            message: "user already exist"
        })
    }
})

app.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username })

        if (!user) {
            res.status(401).json({
                message: "User not found please signup first"
            })
            return;
        }

        const comparePassword = bcrypt.compare(password, user?.password!)
        if (!comparePassword) {
            res.status(411).json({
                message: "password is incorrect"
            })
        }
        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign({
            id: user?._id
        }, jwtSecret!)
        res.json({
            token
        })
    } catch (error) {
        res.status(403).json({
            message: "incorrect credentials"
        })
    }
})

app.post("/content", userMiddleware, async (req, res) => {
    const { title, link, type, text, tags } = req.body;
    try {
        const content = await contentModel.create({
            title,
            type,
            link,
            text,
            tags,
            //@ts-ignore
            userId: req.userId
        })
        res.json({
            content
        })
    } catch (error) {
        res.status(403).json({
            message: "content is not created"
        })
    }

})

app.get("/content", userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;

    try {
        const content = await contentModel.find({
            userId
        })
        const user = await UserModel.findOne({
            _id: userId
        })
        res.json({
            content,
            username: user?.username
        })
    } catch (error) {
        res.status(403).json({
            message: "server is down"
        })
    }
})

app.get("/search", userMiddleware, async (req, res) => {

    try {
        const query = req.query.query;
        const result = await contentModel.find({
            title: query
        })
        res.json({
            content: result
        })
    } catch (error) {
        res.status(403).json({
            message: "server is down"
        })
    }
})

app.delete("/content/:id", userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const contentId = req.params.id;
    try {
        await contentModel.deleteOne({
            userId,
            _id: contentId
        })
        res.status(200).json({
            message: "deleted"
        })
    } catch (error) {
        res.status(411).json({
            message: "can't be deleted"
        })
    }
})

app.put("/content/:id", userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    const contentId = req.params.id;
    const { title, text, tags } = req.body;
    try {
        await contentModel.updateOne({
            userId,
            _id: contentId
        }, {
            $set: {
                title,
                text,
                tags
            }
        })
        res.status(200).json({
            message: "updated"
        })
    } catch (error) {
        res.status(411).json({
            message: "can't be deleted"
        })
    }
})

app.post("/brain/share", userMiddleware, async (req, res) => {
    const share = req.body.share;
    try {
        if (share) {
            const existingShare = await linkModel.findOne({
                //@ts-ignore
                userId: req.userId,
            })
            if (existingShare) {
                res.json({
                    hash: existingShare.hash
                })
                return;
            }
            try {
                const hash = hashGenerator(10);
                await linkModel.create({
                    //@ts-ignore
                    userId: req.userId,
                    hash: hash
                })
                res.json({
                    hash
                })
            } catch (error) {
                res.status(401).json({
                    message: "hash can't be generated"
                })
            }
        } else {
            await linkModel.deleteOne({
                //@ts-ignore
                userId: req.userId
            })
            res.json({
                message: "link removed"
            })
        }
    } catch (error) {
        res.status(403).json({
            message: "something went wrong with sharelink"
        })
    }

})

app.get("/brain/:hash", async (req, res) => {
    const hash = req.params.hash;

    try {
        const link = await linkModel.findOne({
            hash
        })
        if (!link) {
            res.status(403).json({
                message: "link does not found"
            })
        }
        const user = await UserModel.findOne({
            _id: link?.userId
        })
        const content = await contentModel.find({
            userId: link?.userId
        })
        res.json({
            username: user?.username,
            content: content
        })
    } catch (error) {
        res.status(411).json({
            message: "link is not valid"
        })
    }
})

app.listen(3000);