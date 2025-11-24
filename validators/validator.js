const  { createNoteValidation } = require("../validators/notesValidator.js")
const { validationResult } = require("express-validator")

const  { createAuthValidation } = require("../validators/authValidator.js")

module.exports = [
    createNoteValidation,
     (req, res, next) => {
    const err = validationResult(req)
    if (!err.isEmpty()) {
        return res.status(400).json({
            success : false,
            error : err.array()
        })
    }

    next()
}]

module.exports = [
    createAuthValidation,
    (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: err.array()
            })
        }
        next()
    }
]