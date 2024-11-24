import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL as string, {
            });

        console.log("MongoDB Connected");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); 
    }
};

export default connect ;
