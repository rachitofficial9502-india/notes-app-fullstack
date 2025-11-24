const express = require("express")
const router = express.Router()
const validator = require("../validators/validator.js")

const {getAllNotes, createNote, getNoteById, updateNote, deleteNote} = require("../controllers/notesController.js")
const { createNoteValidation } = require("../validators/notesValidator.js")

const { verifyToken } = require("../controllers/authController.js")

router.get("/", verifyToken, getAllNotes)
router.post("/", verifyToken, createNoteValidation, validator, createNote)
router.get("/:id", verifyToken, getNoteById)
router.put("/:id", verifyToken, createNoteValidation, validator, updateNote)
router.delete("/:id", verifyToken, deleteNote)

module.exports = router