import mongoose from 'mongoose';

export const connectDB = async ()=>{
    try{
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined');
        }
        await mongoose.connect(mongoUri);
    }catch(e){
        console.error(e);
    }
}