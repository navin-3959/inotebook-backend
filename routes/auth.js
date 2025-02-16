const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

// Middleware for JSON requests 
router.use(express.json());

// Create a new user 
router.post('/', async (req, res) => {
    try {
        console.log(req.body);

        // Create user instance
        const user = new User(req.body);

        // Save user to DB
        await user.save();

        res.status(201).json({ message: 'User saved successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
