import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import blacklistedTokenModel from "../models/blacklistedTokenModel.js";
import generateRandomStrings from "../utils/generateRandomString.js";
import sendEmail from "../utils/sendMail.js";
import { sendEmailVerification } from "../utils/sendMail.js";
import logger from "../utils/logger.js";

//registration
export const createUser = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(404).json({
        status: "error",
        message: "Request body not found",
      });
    }

    const { password } = req.body;

    //generate salt
    const genSalt = await bcrypt.genSalt(15);

    //hash password
    const hashedPassword = await bcrypt.hash(password, genSalt);

    //generate random token for email email verificationtion
    const emailVerificationToken = generateRandomStrings().toUpperCase();

    //generate email verificationtion expiration
    const emailVerificationExp = Date.now() + 3600000; // next 1 hr

    //save to DB
    const user = await userModel.create({
      ...req.body,
      password: hashedPassword,
      emailVerificationToken,
      emailVerificationExp,
    });

    //send verification email to user
    try {
      sendEmailVerification(user.email, user.userName, emailVerificationToken);
    } catch (error) {
      return next(error);
    }

    // const result = {
    //     username: user.userName,
    //     firstname: user.firstName,
    //     lastname: user.lastName,
    //     email: user.email,
    //     password: user.password,
    //     role: user.role,
    //     emailVerification: user.emailVerified,
    //     accountStatus: user.accountStatus
    // }

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not created successfully",
      });
    }

    const result = {
      id: user._id,
      email: user.email,
      firstname: user.firstName,
      lastname: user.lastName,
      role: user.role,
    }

    return res.status(200).json({
      status: "success",
      message: ["User created successfully", "Verification Email sent"],
      result
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};

//login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //verify email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Email or Password incorrect",
      });
    }

    //verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Email or Password incorrect",
      });
    }

    //generate token
    const token = jwt.sign({ 
      userId: user._id
      // email: user.email, 
      // userName: user.userName 
    }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    return res.status(200).json({
      status: "success",
      message: "login successful",
      // user,
      token,
    });
  } catch (error) {
    console.log(error);
    logger.error(`${error.message}`);
    return next(error);
  }
};

//verify email
export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const userId = req.user._id;

    //find user with Token
    const user = await userModel.findOne({ emailVerificationToken: token });

    //check for user
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    //check if token is expired
    if (user.emailVerificationExp < Date.now()) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired token",
      });
    }
    // Update the user
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id, 
      {
        $set: {
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationExp: null,
        },
      },
      { new: true, runValidators: true } 
    );

    if (!updatedUser) {
      return res.status(400).json({
        status: "error",
        message: "User not found or verification failed"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//resend verification Token
export const resendVerificationToken = async (req, res, next) => {
  try {
    const { email } = req.body;

    //find user with Email
    const user = await userModel.findOne({ email });
    console.log(user);
    

    //check is user is verified
    if (user.emailVerified) {
      return res.status(400).json({
        status: "error",
        message: "Email is already verified",
      });
    }

    //generate new toke and new exp
    const newEmailVerificationToken = generateRandomStrings().toUpperCase();
    const newEmailVerificationExp = Date.now() + 3600000;

    user.emailVerificationToken = newEmailVerificationToken;
    user.emailVerificationExp = newEmailVerificationExp;
    await user.save();

    //send new mail
    sendEmailVerification(user.email, user.userName, newEmailVerificationToken);

    return res.status(200).json({
      status: "success",
      message: "new verification Token sent",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Account not found",
      });
    }

    const resetPasswordToken = generateRandomStrings();
    const resetPasswordExp = Date.now() + 3600000; // 1 hour expiration
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExp = resetPasswordExp;
    await user.save();

    const resetUrl = `http://${req.headers.host}/reset-password?token=${resetPasswordToken}`;

    sendEmail(user.email, user.userName, resetUrl);

    return res.status(200).json({
      status: "success",
      message: "email sent",
    });
  } catch (error) {
    console.log(error);
    next(error);
    logger.error(`${error.message}`);
  }
};

//reset password
export const resetPassword = async (req, res, next) => {
  try {
    const { resetPasswordToken, newPassword } = req.body;

    if (!resetPasswordToken || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "no body found",
      });
    }

    const user = await userModel.findOne({
      resetPasswordToken: resetPasswordToken,
      resetPasswordExp: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired token",
      });
    }

    //update password
    const newSalt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(newPassword, newSalt);
    user.resetPasswordToken = null;
    user.resetPasswordExp = null;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//logout
export const logout = async (req, res, next) => {
  const { token } = req.body;
  // if (!token) {
  //     return res.status(400).json({
  //         status: "error",
  //         message: "Token required"
  //     })
  // }
  try {
    await blacklistedTokenModel.create({ token });
    return res.status(200).json({
      status: "success",
      message: "Logout successful",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
