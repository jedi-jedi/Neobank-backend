import crypto from "crypto";

const generateRandomStrings = (num = 3) => {
    const randomStrings = crypto.randomBytes(num).toString("hex");

    return randomStrings;
};

export default generateRandomStrings;