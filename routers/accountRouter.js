import express from "express";
import { createAccount, getAccounts, getAccountById } from "../controllers/accountController.js";
import { isloggedIn } from "../middlewares/isloggedIn.js";
const accountRouter = express.Router();

accountRouter.post("/create-account", isloggedIn, createAccount);
accountRouter.get("/get-accounts", isloggedIn, getAccounts);
accountRouter.get("/account/:id", isloggedIn, getAccountById);


export default accountRouter;