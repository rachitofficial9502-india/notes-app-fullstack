const express = require("express")
const router = express.Router()

const {getAllNotes, createNote, getNoteById, updateNote, deleteNote} = require("../controllers/notesController.js")

router.get("/", getAllNotes)
router.post("/", createNote)
router.get("/:id", getNoteById)
router.put("/:id", updateNote)
router.delete("/:id", deleteNote)

module.exports = router