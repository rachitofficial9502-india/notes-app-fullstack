const { body } = require("express-validator")

exports.createNoteValidation = [
    body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({min:3})
    .withMessage("Title must be atleast 3 characters long."),

    body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required.")
    .isLength({min:5})
    .withMessage("Content must be atleast 5 characters long.")
]