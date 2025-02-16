const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')

// Middleware for JSON requests 
router.use(express.json());

const JWT_SECRET = "HARRYBHAI"

// Create a new user 
router.post('/', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "A user with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10)
        let secpass = await bcrypt.hash(req.body.password, salt)

        // Create and save new user without password hashing
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: secpass, // Storing raw password (not recommended for production)
        });
   const data = {
    user:{
        id:user.id
    }
   }
        await user.save(); // Save user to the database

        const authtoken = jwt.sign(data, JWT_SECRET)
        console.log(authtoken)
        res.json({ message: "User created successfully!", authtoken,user });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Some error occurred");
    }
});

module.exports = router;
