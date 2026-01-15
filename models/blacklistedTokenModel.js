import mongoose from "mongoose";


const blacklistedTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required"],
        unique: true
    }
});

const blacklistedTokenModel = mongoose.model("blacklistedToken", blacklistedTokenSchema);
export default blacklistedTokenModel;