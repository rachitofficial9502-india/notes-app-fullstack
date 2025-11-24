const User = require("../models/user.js")
require("dotenv").config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

async function signUp(req, res) {

    const { name, email, password } = req.body
    
    try {
            let user = await User.findOne({email})
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists."
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        return res.status(201).json({
            success: true,
            message: "User created succesfully."
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            success: false,
            message: "Server error"
        })
    }

}

async function login(req, res) {
    
    let { email, password } = req.body

    if ( !email || !password || password == "" || email == "" ) {
        return res.status(400).json({
            success: false,
            message: "Fields can't be left empty!"
        })
    }

    let user = await User.findOne({email: email.toLowerCase()})

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password."
        })
    }
    let isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password."
        })
    }

    const secret = process.env.JWT_SECRET
    const payload = {
        id : user._id
    }
    const token = jwt.sign(payload, secret, { expiresIn: "1m"})

    return res.status(200).cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24*60*60*1000
    }).json({
        success: true,
        user: user.name,
        message: "Welcome, " + user.name,
        token: token
    })

}

// verifying token middleware
function verifyToken(req, res, next) {

    const token = req.cookies.token

    if (!token) {
        res.status(401).json({
            success: false,
            message: "No token provided."
        })
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded.id
        next()
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        })
    }

}

module.exports = {
    signUp, login, verifyToken
}