const express = require("express")
const router = express.Router()
const { signUp, login } = require("../controllers/authController.js")
const { createAuthValidation } = require("../validators/authValidator.js")
const validator= require("../validators/validator.js")

router.post("/login", createAuthValidation, validator, login)
router.post("/signup", createAuthValidation, validator, signUp)

module.exports = router