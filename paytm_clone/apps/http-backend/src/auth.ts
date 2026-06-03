import { verifyToken } from "@repo/jwt";
import { NextFunction, Request, Response } from "express";

export const authMiddleware=(req:Request,res:Response,next:NextFunction)=>{

    const token=req.headers["authorization"]??"";
    try{
        const decoded=verifyToken(token);
        if (!token){
            return res.status(503).json({
                message:"missing token, try again"
            })
        }

        if (decoded && typeof decoded !=="string" ){
            req.id=decoded.id
        }
    }

    catch(e){
        res.status(403).json({
            message:"token is missing or expired,Please try again",
            error:e
        })
    }

}