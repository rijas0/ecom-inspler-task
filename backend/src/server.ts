import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import {connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors({
    origin:process.env.CLIENT_URL
}));
app.use(express.json());

app.get('/api/hello',(req,res)=>{
    res.status(200).json({
        success:true,
        message:'Hello world'
    })
})

const startServer = async ()=>{
    await connectDB();
    app.listen(PORT,()=>{
        console.log(`Server running on PORT ${5000}`);
    })
}
startServer();