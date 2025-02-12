const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Ensure dotenv is loaded

const secretKey = process.env.SECRET_KEY || "default_secret_key"; // Fallback for safety

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Not a valid email address");
            }
        }
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!/^\d{10}$/.test(value)) {
                throw new Error("Mobile number must be exactly 10 digits");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    carts: Array
});

// 🔐 Hash Password Before Saving
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        console.log("🔐 Hashing password...");
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});


// 🔑 Generate JWT Token
userSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY, { expiresIn: "30d" });
        this.tokens = this.tokens.concat({ token });
        await this.save();
        console.log("✅ Token saved:", token); // Debugging
        return token;
    } catch (error) {
        console.error("❌ Token generation error:", error.message);
    }
};

const User = mongoose.model("User", userSchema); // ✅ Fixed model name
module.exports = User;
