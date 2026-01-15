import wiston from "winston";
const { createLogger, format, transports } = wiston;

const logger = createLogger({
    transports : [
        new transports.File({
            filename: '../log/index.log',
            level: 'error',
            format: format.combine(format.timestamp({ format: "YYYY-MM-DD HH:mm:ss"}), 
            format.printf((info)=>`${info.timestamp} ${info.level.toUpperCase()} : ${info.message}`))
        })
    ]
});

export default logger;