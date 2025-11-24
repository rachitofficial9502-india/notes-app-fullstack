const express = require("express")
const router = express.Router()
const { signUp, login, verifyToken } = require("../controllers/authController.js")
const { createAuthValidation } = require("../validators/authValidator.js")

router.post("/login", createAuthValidation, validator, login)
router.post("/signup", createAuthValidation, validator, signUp)

module.exports = router