import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
    logger.error(`${req.method} ${req.url} - ${err.message}`);
    
    if (err.code === 11000) {
        return res.send("Duplicate error");
    } else {
        return res.status(400).json({
            status: "error",
            message: "Something went wrong",
            stack: err.stack,
            code: err.code,
            text: err.text
        });
    }
}

export default errorHandler;