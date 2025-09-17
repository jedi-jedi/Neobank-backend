import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: [true, "this username has already been used"],
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, "email already exist"]
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    emailVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const userModel = mongoose.model("users", userSchema);
export default userModel;