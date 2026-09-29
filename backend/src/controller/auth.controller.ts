import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/User";
import { registerSchema, loginSchema } from "../schemas/auth.schema";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
    try{
        const data = registerSchema.parse(req.body);
        const email = data.email.toLowerCase();
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                success:false,
                message:"Email already exist",
            });
        }
        const passwordHash = await bcrypt.hash(data.password,10);

        const user = await User.create({
            name:data.name,
            email,
            passwordHash,
            role: "user",
        })

        const token = generateToken(user._id.toString(), user.role);

        return res.status(201).json({
            success:true,
            message:"Regstration successfull",
            data:{
                user:{
                    id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role
                },
                token:token,
            },
        });
    }catch(e){
        next(e);
    }
};

export const login = async (req:Request,res:Response,next:NextFunction)=>{
    try{
        const data = loginSchema.parse(req.body);
        const email = data.email.toLowerCase();
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password",
            })
        }

        const passwordMatch = await bcrypt.compare(
            data.password,
            user.passwordHash
        );
        if(!passwordMatch){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password",
            });
        }

        const token = generateToken(user._id.toString(),user.role);
        return res.status(200).json({
            success:true,
            message:"Login Successfull",
            data:{
                user:{
                    id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role
                },
                token:token,
            },
        });

    }catch(e){
        next(e);
    }
}

const generateToken = (userId: string, role: string) => {
  return jwt.sign(
    {
      userId,
      role,
    },
    process.env.JWT_SECRET as string,
    { expiresIn: "3d" },
  );
};
