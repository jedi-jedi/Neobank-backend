import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import transporter from "../config/emailConfig.js";

//recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const sendEmail = (email, userName, resetUrl)=>{

    const templatePath = path.join(__dirname, "templates", "resetEmailTemplate.html");
    let htmlContent = fs.readFileSync(templatePath, "utf8");

    htmlContent = htmlContent
        .replace(/{{USER_NAME}}/g, userName)
        .replace(/{{RESET_URL}}/g, resetUrl);

    transporter.sendMail({
        to: email,
        subject: "Password Reset Request",
        html: htmlContent,
        
    }, (err, info)=>{
        if (err) {
            console.log(err.message);
            
        }else {
            console.log(`email sent to ${email}`);
            
        }
    });
}

export const sendEmailVerification = (email, userName, emailVerificationToken) => {

    const templatePath = path.join(__dirname, "templates", "emailVerificationTemplate.html");
    let htmlContent = fs.readFileSync(templatePath, "utf8");

    htmlContent = htmlContent
        .replace(/{{USER_NAME}}/g, userName)
        .replace(/{{TOKEN}}/g, emailVerificationToken)

    transporter.sendMail({
        to: email,
        subject: "Email Verification",
        html: htmlContent,

    }, (err, info)=>{
        
        if (err) {
            console.log(err.message);
            
        }else {
            console.log(`email sent to ${email}`);
            
        }
    });
}

export default sendEmail;