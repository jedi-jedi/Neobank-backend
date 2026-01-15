import accountModel from "../models/accountModel.js";
import { generateAccountNumber } from "../utils/generateAccountNumber.js";


export const createAccount = async (req, res, next) => {
    try {
        const { accountType, currency } = req.body;
        // const { emailVerified } = req.user;
        const userId = req.user._id;
    
        //check if email is verified
        if (!req.user.emailVerified) {
            return res.status(400).json({
                status: "error",
                message: "verify your email first"            
            });
        }

        // let accountNumber;

        // if (req.body.accountNumber) {
            //     accountNumber = req.body.accountNumber
            // } else {
                //     accountNumber = await generateAccountNumber();
                // }
        // const accountNumber = req.body.accountNumber || generateAccountNumber();

        //generate Account Number
        const accountNumber = await generateAccountNumber();
        
        
        const accountDetail = await accountModel.create({ 
            accountNumber,
            accountType: accountType || "SAVINGS",
            balance: 0.00,
            status: "ACTIVE",
            user: userId,
            currency: currency
        });
        
        
        return res.status(200).json({
            status: "success",
            message: "Account created successfully",
            accountDetail,
            
        });

    } catch (error) {
        console.log(error);
        
        next(error);
    }
}

// get account for a user by using the user id from the middleware (JWT)
export const getAccounts = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(400).json({
                status: "error",
                message: "User not authenticated"
            });
        }

        // const { userId } = req.params;
        const userId  = req.user._id;
        const { status } = req.query;

        const query = { user: userId };
        if (status && ["ACTIVE","DORMANT", "UNDER-REVIEW", "FROZEN"].includes(status)) {
            query.status = status;
        }    

        const userAccounts = await accountModel.find(query);
        // console.log(userAccounts);
        
        return res.status(200).json({
            status: "success",
            message: "Accounts fetched successfully",
            data: userAccounts
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
}

//get an account by id
export const getAccountById = async (req, res, next) => {
    try {

        //Get logged-in user from req.user(set by isLoggedIn.js)
        const userId = req.user._id;

        //get account id
        const accountId = req.params.id;

        //find an Account
        const anAccount = await accountModel.findOne({ _id: accountId, user: userId});
        if (!anAccount) {
            return res.status(404).json({
                status: "error",
                message: "Account not found"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Account found",
            data: anAccount
        })

    } catch (error) {
        console.log(error);
        return next(error)
        
    }
}