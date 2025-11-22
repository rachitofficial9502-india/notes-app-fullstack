const express = require("express")
const router = express.Router()
const validator = require("../validators/validator.js")

const {getAllNotes, createNote, getNoteById, updateNote, deleteNote} = require("../controllers/notesController.js")
const { createNoteValidation } = require("../validators/notesValidator.js")

router.get("/", getAllNotes)
router.post("/",createNoteValidation, validator, createNote)
router.get("/:id", getNoteById)
router.put("/:id",createNoteValidation, validator, updateNote)
router.delete("/:id", deleteNote)

module.exports = router