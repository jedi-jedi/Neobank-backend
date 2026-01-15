import accountModel from "../models/accountModel.js";

export const generateAccountNumber = async (req, res, next) => {
    try {
        const maxRetries = 10;
        const attempts = 0;
    
        while (attempts < maxRetries) {
            const accountNum = Math.floor(Math.random()*1e10).toString();
    
            //check if it exist
            const existing = await accountModel.findOne({ accountNumber: accountNum });
    
            if (!existing) {
                return accountNum;
            }
        }
        
        attempts++
    } catch (error) {
        next(error)
    }

}