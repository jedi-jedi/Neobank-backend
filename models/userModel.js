import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: [ true, "Username already exist"]
    },
    firstName:{
        type: String,
        required: [ true, "firstName is required"]
    },
    lastName:{
        type: String,
        required: [ true, "lastName is required"]
    },
    email: {
        type: String,
        required: [ true, "Email is required"],
        unique: [true, "email already exist"]
    },
    password: {
        type: String,
        required: [ true, "Password is required"],
    },
    phone: {
        type: String,
        required: [ true, "Phone number is required"]
    },
    role: {
        type: String,
        enum: ["admin", "editor", "customer"],
        default: "customer"
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExp: {
        type: String
    },
    emailVerificationToken: {
        type: String
    },
    emailVerificationExp: {
        type: String
    }
}, { timestamps: true });

const userModel = mongoose.model("users", userSchema);
export default userModel;