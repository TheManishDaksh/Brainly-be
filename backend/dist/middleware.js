"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function userMiddleware(req, res, next) {
    const header = req.headers["authorization"];
    const decoded = jsonwebtoken_1.default.verify(header, process.env.JWT_SECRET);
    if (decoded) {
        if (typeof decoded === "string") {
            res.status(403).json({
                message: "user is not signedin"
            });
            return;
        }
        //@ts-ignore
        req.userId = decoded.id;
        next();
    }
    else {
        res.status(403).json({
            message: "user is not authenticated"
        });
    }
}
