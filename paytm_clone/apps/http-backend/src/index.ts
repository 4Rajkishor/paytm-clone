import express from "express";
import {SigninSchema,SignupSchema} from "@repo/common/types"
import bcrypt from "bcrypt";
import{prismaClient} from "@repo/db/dbSchema"
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
    
    const saltPassword=await bcrypt.hash(parshedData.data.password,10);
     await prismaClient.user.create({
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
    catch(e){
      res.status(503).json({
        message:"something went wrong, please try again",
        error:e
      })
    }

});

app.post("/api/signin",(req,res)=>{
    const parshedData=SigninSchema.safeParse(req.body);
    if (!parshedData.success){
        res.json("invalid email or password format, pleae try again")
        return
    }



});


app.listen (3000,()=>{
    console.log("port is listening on port 3000")
});