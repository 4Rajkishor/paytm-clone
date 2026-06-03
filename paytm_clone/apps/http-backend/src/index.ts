import dotenv from "dotenv";
dotenv.config();
import express from "express";
import {SigninSchema,SignupSchema} from "@repo/common/types"
import bcrypt from "bcrypt";
import{prismaClient} from "@repo/db/db"
import { signToken,verifyToken } from "@repo/jwt";
const app= express();

app.use(express.json());

app.post("/api/signup",async(req,res)=>{
    try {
        
    const parshedData=SignupSchema.safeParse(req.body);
    if (!parshedData.success){
        res.status(404).json({
           message:"invalid format, please try again"
        });
        return
    }
    console.log(parshedData);
    const saltPassword=await bcrypt.hash(parshedData.data.password,10);

    console.log("received Data");
     const db= await prismaClient.user.create({
        data:{
            username:parshedData.data.username,
            password:saltPassword,
            email:parshedData.data.email
        }
          }
     );

   

     res.status(200).json({
        message:"congratul;ations, you have been signedup successfully"
     })
    }
    catch(e:any){
        if (e.code=="P2002"){
    res.status(403).json({
        message:"user already exists"
    })
    return
   }
      res.status(503).json({
        
        message:"something went wrong, please try again",
        error:e
      })
    }

});

app.post("/api/signin",async(req,res)=>{
    const parshedData=SigninSchema.safeParse(req.body);
    if (!parshedData.success){
        res.json("invalid email or password format, pleae try again")
        return
    }

 const existingUser=await prismaClient.user.findUnique({
    where:{
        email:parshedData.data.email
    }
 });
if (!existingUser){
    res.status(200).json({
        message:"cant not find user, please signup again or try different email id"
    });
    return
}
 if (existingUser ){
    const matchedPassword=await bcrypt.compare(parshedData.data.password,existingUser.password);
        if (!matchedPassword){
            res.status(404).json({
                message:"password not matching"
            }); return
        }    
 }

    const token= signToken({id:existingUser.id})
    res.status(200).json({
    message:"signed in successfully",
    token:token
    })
});


app.listen (3005,()=>{
    console.log("port is listening on port 3005")
});