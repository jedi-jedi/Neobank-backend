import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import connectToDb from "./config/DBConnect.js";
connectToDb();


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 5000;


app.get("/api/v1", (req, res) => {
    res.send("Welcome to Neobank")
});



app.listen(PORT, ()=>{
    console.log(`The App is running on port ${PORT}`);
    
})


//routes
import userRouter from "./routers/userRoute.js";
import accountRouter from "./routers/accountRouter.js";
import errorHandler from "./middlewares/errorHandler.js";


app.use("/users", userRouter);
app.use("/account", accountRouter);



app.use("/{*any}", errorHandler);