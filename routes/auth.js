/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')
var fetchuser = require('../middleware/fetchuser')
// Middleware for JSON requests 
router.use(express.json());
const JWT_SECRET = "HARRYBHAI"

// Create a new user route 1
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

        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: secpass, 
        });
        const data = {
            user: {
                id: user.id
            }
        }
        await user.save(); // Save user to the database

        const authtoken = jwt.sign(data, JWT_SECRET)
        console.log(authtoken)
        res.json({ message: "User created successfully!", authtoken, user });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Some error occurred");
    }
});

//authanticate a user route 2
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cant not be blank').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user =await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "Please try to login with rigth credantials" })
        }
        const passcomp =await bcrypt.compare(password, user.password);
        if (!passcomp) {
            return res.status(400).json({ error: "Please try to login with rigth credantials" })

        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        res.json(authtoken)
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Internal server error occurred");
    }
})

//got logged in user details using post "api/auth/getuser" route 3 -- login required
router.post('/getuser', fetchuser,async (req, res) => {
try {
   let  userId = req.user.id
    const user = await User.findById(userId).select("-password")
    res.send(user)
} catch (error) {
    console.error("Error:", error.message);
        res.status(500).send("Internal server error occurred");
}
})
module.exports = router;
