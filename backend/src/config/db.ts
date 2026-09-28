import mongoose from 'mongoose';

export const connectDB = async ()=>{
    try{
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined');
        }

        const connection = await mongoose.connect(mongoUri);

        console.log('Mongodb connected');
    }catch(e){
        console.log("MongoDb connection failed: ",e);
    }
}