const Note = require("../models/note.js")

async function getAllNotes(req, res) {

    try {
        const notes = await Note.find()
        return res.status(200).json({
                success : true,
                notes : notes
            })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
                success : false,
                message : "Server error while fetching notes..."
            })
    }
}

async function createNote(req, res) {

    try {
        const { title, content } = req.body
        if (!title && !content) {
            
            return res.status(400).json({
                    success : false,
                    message : "Title and content can't be left empty!"
                })

        } else {

            const newNote = await Note.create({
                title,
                content
            })
            return res.status(201).json({
                    success : true,
                    notes : newNote
                })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
                success : false,
                message : "An error occured while creating notes..."
            })
    }

}

async function getNoteById(req, res) {

    const id = req.params.id
    try {
        const note = await Note.findById(id)
        if (note) {
            return res.status(200).json({
                success : true,
                note : note
            }) 
        } else {
            return res.status(400).json({
                success : false,
                message : "Note not found!"
            })
        }
    } catch (err) {
        return res.status(500).json({
                success : false,
                message : "An error occured while fetching notes..."
            })
    }

}

async function updateNote(req, res) {

    const { id } = req.params
    const { title, content } = req.body

    try {
        if (!title && !content) {
            
            return res.status(400).json({
                    success : false,
                    message : "Title or content should be provided!"
                })

        }

        const note = await Note.findById(id)
        if (!note) {
            return res.status(404).json({
                success : false,
                message : "Note not found"
            })
        }
        if ( title !== undefined ) {
            note.title = title
        }  
        if ( content !== undefined ) {
            note.content = content
        }
        const updatedNote = await note.save()
        return res.status(200).json({
            success : true,
            note : updatedNote
        })

        }

    catch (err) {

        console.log(err)
        return res.status(500).json({
            success : false,
            message : "An error occured while updating note..."
        })

    } 

}

async function deleteNote(req, res) {

    try {

        const { id } = req.params

        const deletedNote = await Note.findByIdAndDelete(id)

        if (!deletedNote) {
            return res.status(500).json({
                success : false,
                message : "Note not found"
            })
        }
        return res.status(200).json({
            success : true,
            note : deletedNote
        })

    } catch (err) {

        console.log(err)
        res.status(404).json({
            success : false,
            message : 'An error occured while deleting note...'
        })

    }

}

module.exports = {
    getAllNotes, createNote, getNoteById, updateNote, deleteNote
}