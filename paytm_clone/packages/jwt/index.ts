import dotenv from "dotenv"
dotenv.config();
import jwt from "jsonwebtoken";

export function signToken(payload:object){

    if (!process.env.JWT_SECRET){
        throw new Error("JWT is missing");
    }

    return jwt.sign(payload,process.env.JWT_SECRET)
}

export function verifyToken(token:string){

    if (!process.env.JWT_SECRET){
        throw new Error("jwt is missing");       
    }

     return jwt.verify(token,process.env.JWT_SECRET)
}