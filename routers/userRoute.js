import express from "express";
import { createUser, forgotPassword, login, logout, resendVerificationToken, resetPassword, verifyEmail } from "../controllers/userController.js";
import { isloggedIn } from "../middlewares/isloggedIn.js";
const userRouter = express.Router();

userRouter.post("/signup", createUser);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/verify-email/:token", isloggedIn, verifyEmail);
userRouter.post("/re-verify", isloggedIn, resendVerificationToken);


export default userRouter;