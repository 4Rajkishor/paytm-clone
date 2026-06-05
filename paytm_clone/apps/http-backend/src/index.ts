import dotenv from "dotenv";
dotenv.config();
import express from "express";
import {SigninSchema,SignupSchema} from "@repo/common/types"
import bcrypt from "bcrypt";
import{prismaClient} from "@repo/db/db"
import { signToken,verifyToken } from "@repo/jwt";
import { authMiddleware } from "./auth.js";
import { userInfo } from "os";
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
     const user= await prismaClient.user.create({
        data:{
            username:parshedData.data.username,
            password:saltPassword,
            email:parshedData.data.email
        }
          } 
     );
     
        const userId = user.id;

     await prismaClient.account.create({
        data:{
            balance:1+Math.random()*10000,
            userId: userId
        }
     });
      
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

app.get("/bulk",authMiddleware,async(req,res)=>{
    const filter =req.query.filter;
    if (!filter || typeof filter !== 'string'){
      return  res.status(403).json({
            message:'filter is missing'
        })
        
    }
    const user=await prismaClient.user.findMany({
        where:{
            username:{
                startsWith:filter
            }
        }
    });
    return res.status(200).json({
        user:user.map ((u)=>u.username
     )
    })
})

app.get("/api/balanace",authMiddleware,async(req,res)=>{
    let userid=req.id

   const accountBalance= await prismaClient.account.findUnique ({
        where:{
            userId:req.id
        }
    });
    res.status(200).json({
        Balance:accountBalance?.balance
    });
});

app.post("/api/transfer",authMiddleware,async(req,res)=>{
     const{amount,to}=req.body;
     try{
     await prismaClient.$transaction(async (tx)=>{
        const sender=await tx.account.update({
            data:{balance:{decrement:amount}},
            where:{userId:req.id}
        });
        if (sender.balance<0){
            
              throw new Error ("insufficiaent fund")
         
        }
         await tx.account.update({
            data:{balance:{increment:amount}},
            where:{userId:to}
        })

        res.status(200).json({
             Message:"payment has been sent successfully"
        })
     })
    }
    catch(e){
        res.status(403).json({
            message:"insufficnet fund",
            error:e
        })
    }
});




app.listen (3005,()=>{
    console.log("port is listening on port 3005")
});