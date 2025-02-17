/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const Note = require('../models/Note');
var fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');


// Route 1 get all the notes "api/auth/getuser"  -- login required
router.get('/fetchnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Internal server error occurred");
    }
   

})


// Route-2 add a new note "api/auth/addnote"  -- login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid name').isLength({ min: 3 }),
    body('description', 'Description must of 5 char').isLength({ min: 5 }),
], async (req, res) => {
try {
    const {title,description,tag,}= req.body

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const note = new Note ({
      title, description,tag,user:req.user.id
    })
   const  savenote = await note.save()

    res.json(savenote)
} catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal server error occurred");
}
    

})

module.exports = router