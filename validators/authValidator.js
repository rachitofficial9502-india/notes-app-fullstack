const { body } = require("express-validator")

exports.createAuthValidation = [
    body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required."),

    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required.")
]