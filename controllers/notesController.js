const Note = require("../models/note.js")

async function fetchNotes(req, res, filter = {}, sort) {

    const { skip, limit } = pageNotes(req)

    if (sort) {
        try {
            const notes = await Note.find(filter).sort(sort).skip(skip).limit(limit)
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

    try {
            const notes = await Note.find(filter).skip(skip).limit(limit)
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

function sortNotes(req, res, filter) {

    const sort = req.query.sort

    if (!sort || sort == "") {
        return fetchNotes(req, res, filter)
    }
    if (sort == "newest"){
        return fetchNotes(req, res, filter, {_id: -1})
    }
    if (sort == "oldest") {
        return fetchNotes(req, res, filter, {_id: 1})
    }

    return fetchNotes(req, res, filter)

}

function pageNotes(req) {
    
    let page = req.query.page
    let limit = req.query.limit

    if (!page || page == "") {
        page = 1
    } else {
        page = Number(page)
    }
    if (!limit || limit == "") {
        limit = 10
    } else {
        limit = Number(limit)
    }

    const skip = (page - 1)*limit

    return { skip, limit }

}

async function getAllNotes(req, res) {

    const search = req.query.search

    const baseFilter = {user: req.user}

    if (!search || search == "") {

        return  sortNotes(req, res, baseFilter)

    }

    const filter = {

        $or : [
            {user: req.user},
            {title: { $regex : search, $options: "i"}},
            {content: { $regex: search, $options: "i"}}
        ]
    }

    return sortNotes(req, res, filter)
    
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
                content,
                user: req.user
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
        const note = await Note.findOne({_id: id, user: req.user})
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

        const note = await Note.findOne({_id: id, user: req.user})
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

        const note = await Note.findOne({_id: id, user: req.user})
        if (!note) {
            return res.status(404).json({
                success : false,
                message : "Note not found"
            })
        }

        const deletedNote = await note.deleteOne()

        return res.status(200).json({
            success : true,
            note : deletedNote
        })

    } catch (err) {

        console.log(err)
        res.status(500).json({
            success : false,
            message : 'An error occured while deleting note...'
        })

    }

}

module.exports = {
    getAllNotes, createNote, getNoteById, updateNote, deleteNote
}