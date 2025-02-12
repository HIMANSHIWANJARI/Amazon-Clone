const express = require("express");
const router = new express.Router();
const products = require("../models/productsSchema");
const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");

// Get all products
router.get("/getproducts", async (req, res) => {
    try {
        const productsData = await products.find();
        console.log("✅ Products fetched successfully");
        res.status(200).json(productsData);
    } catch (error) {
        console.error("🚨 Error fetching products:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Register a new user
// Register a new user
router.post("/register", async (req, res) => {
    const { fname, email, mobile, password, cpassword } = req.body;

    if (!fname || !email || !mobile || !password || !cpassword) {
        return res.status(422).json({ error: "Please fill all details" });
    }

    try {
        const preuser = await User.findOne({ email });

        if (preuser) {
            return res.status(422).json({ error: "This email is already registered" });
        }
        
        if (password !== cpassword) {
            return res.status(422).json({ error: "Passwords do not match" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fname,
            email,
            mobile,
            password: hashedPassword, // Save only the hashed password
        });

        const savedUser = await newUser.save();

        // Generate JWT Token after registration
        const token = await savedUser.generateAuthToken();

        console.log("User registered and logged in successfully");

        res.status(201).json({
            message: "User registered and logged in successfully",
            user: savedUser,
            token, // Send the token to the frontend
        });
    } catch (error) {
        console.error("Registration error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Login User
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Ensure there's no leading or trailing space in the entered password
        const trimmedPassword = password.trim();

        // Log password attempt for debugging
        console.log("🔹 Entered Password:", trimmedPassword);

        // Find user by email
        const user = await USER.findOne({ email });

        if (!user) {
            console.log("❌ User not found");
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Compare trimmed password with hashed password stored in DB
        const isMatch = await bcrypt.compare(trimmedPassword, user.password);
        console.log("🔹 Password Match:", isMatch);

        if (!isMatch) {
            console.log("❌ Incorrect password");
            return res.status(400).json({ error: "Invalid credentials" });
        }

        console.log("✅ Login successful");
        res.status(200).json({ message: "Login successful!" });

    } catch (error) {
        console.error("🚨 Error in login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Get individual product
router.get("/getproductsone/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await products.findById(id); // ✅ FIXED: Using `findById(id)`

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("🚨 Error fetching product:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Add product to cart
router.post("/addcart/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const product = await products.findById(id); // ✅ FIXED: Using `findById(id)`

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const user = await User.findById(req.userID);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.cart.push(product);
        await user.save();

        res.status(200).json({ message: "✅ Product added to cart", cart: user.cart });
    } catch (error) {
        console.error("🚨 Error adding to cart:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get cart details
router.get("/cartdetails", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userID);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user.cart);
    } catch (error) {
        console.error("🚨 Error fetching cart details:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Check if user is authenticated
router.get("/validuser", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userID);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("🚨 Error verifying user:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Logout user
router.get("/logout", authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userID);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.tokens = user.tokens.filter((tokenObj) => tokenObj.token !== req.token);

        await user.save();
        res.clearCookie("ecommerce");

        res.status(200).json({ message: "✅ Logout successful" });
    } catch (error) {
        console.error("🚨 Error logging out:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Remove item from cart
router.delete("/remove/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(req.userID);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.cart = user.cart.filter((item) => item._id.toString() !== id); // ✅ FIXED: Used `item._id.toString()`
        await user.save();

        res.status(200).json({ message: "✅ Item removed from cart", cart: user.cart });
    } catch (error) {
        console.error("🚨 Error removing item from cart:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
