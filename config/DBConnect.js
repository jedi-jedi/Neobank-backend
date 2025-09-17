import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

const mongoDbUri = process.env.MONGODB_URI;
const connectToDb = async () => {
    try {
        console.log("connecting to DB🔄...");
        const connected = await mongoose.connect(mongoDbUri);
        if (connected) {
            console.log("You are connected to the Database😎🚀");
            
        }
    } catch (error) {
        console.log(error);
        
    }
}

export default connectToDb;