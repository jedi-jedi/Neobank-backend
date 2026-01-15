import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        required: [true, "Account number is required"],
        unique: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); //10-digit account number
            },
            message: "Account number must be 10-digit number"
        }
    },
    accountType: {
        type: String,
        enum: ["SAVINGS", "CURRENT", "CORPORATE"],
        default: "SAVINGS"
    },
    balance: {
        type: mongoose.Schema.Types.Decimal128,
        required: [true, "balance is required"],
        min: [0, "Balnace cannot be negative"],
        default: "0.00",
        get: v => parseFloat(v).toFixed(2) // format as strings with 2 decimals
    },
    status: {
        type: String,
        enum: ["ACTIVE", "DORMANT", "UNDER-REVIEW", "FROZEN"],
        default: "ACTIVE"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    currency: {
        type: String,
        enum: ["USD", "EUR", "NGN"],
        default: "NGN"
    }
}, { 
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true } // used this to fix the json output of the balance.
});

//add index for userRef queries
accountSchema.index({ user: 1, status: 1 });

const accountModel = mongoose.model("Account", accountSchema);
export default accountModel;