import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASS
    }
});

transporter.verify((err, success) => {
    if (!success) {
        console.log(err);
        
    } else {
        console.log("nodemailer is ready to send email");
        
    }
});

export default transporter;