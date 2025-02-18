/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const Note = require('../models/Note');
var fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');
const { default: mongoose } = require('mongoose');


// Route 1 get all the notes "api/notes/getuser"  -- login required
router.get('/fetchnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Internal server error occurred");
    }


})


// Route-2 add a new note "api/notes/addnote"  -- login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid name').isLength({ min: 3 }),
    body('description', 'Description must of 5 char').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag, } = req.body

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const savenote = await note.save()

        res.json(savenote)
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send("Internal server error occurred");
    }


})


// Route-3 update and existing note using put  "api/notes/updatenote"  -- login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {

        const { title, description, tag } = req.body;
        const { id } = req.params;

        //validate id format
        if (!mongoose.Types.ObjectId.isValid(id)) { return res.status(400).json({ error: "invalid note id" }) }

        //find note by id 
        let note = await Note.findById(id)
        if (!note) { return res.status(400).json({ error: "note not found" }) }

        //check if the user own the note
        if (note.user.toString() !== req.user.id) { return res.status(403).json({ error: "not allowed" }) }

        // create a newnote object
        const newnote = {};
        if (title) { newnote.title = title }
        if (description) { newnote.description = description }
        if (tag) { newnote.tag = tag }

        //find the to be updated 
        note = await Note.findByIdAndUpdate(id, { $set: newnote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.error("Error updating note:", error.message);
        res.status(500).send("Internal server error occurred");
    }

})
// Route-4 delete an existing and existing note using put  "api/notes/deletenote"  -- login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {

        // const { title, description, tag } = req.body;
        const { id } = req.params;

        //validate id format
        if (!mongoose.Types.ObjectId.isValid(id)) { return res.status(400).json({ error: "invalid note id" }) }

        //find note by id 
        let note = await Note.findById(id)
        if (!note) { return res.status(400).json({ error: "note not found" }) }

        //check if the user own the note
        if (note.user.toString() !== req.user.id) { return res.status(403).json({ error: "not allowed" }) }

        

        //find the to be updated 
        await Note.findByIdAndDelete(id)
        res.json({ success:"note has been deleted" ,note:note})
    } catch (error) {
        console.error("Error updating note:", error.message);
        res.status(500).send("Internal server error occurred");
    }

})
module.exports = router