import express from "express";
import {SigninSchema,SignupSchema} from "@repo/common/schema"
import bcrypt from "bcrypt"
const app= express();

app.use(express.json());

app.post("/api/signup",(req,res)=>{
    const parshedData=SignupSchema.safeParse(req.body);
    if (!parshedData.success){
        res.status(404).json({
           message:"invalid format, please try again"
        });
        return
    }
    
    const saltPassword=bcrypt.hash(parshedData.data.password,10);

});

app.post("/api/signin",(req,res)=>{

});


app.listen (3000,()=>{
    console.log("port is listening on port 3000")
});