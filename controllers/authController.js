const User = require("../models/user.js")
require("dotenv").config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const { generateAccessToken, generateRefreshToken } = require("../helpers/tokenGenerator.js")

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

    console.log("Login Hit")
    console.log("Email:", email)

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

    console.log("USER:", user);

    let isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password."
        })
    }

    const payload = {id: user._id}

    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)

    console.log("accesstoken:", accessToken)
    console.log("refreshToken", refreshToken)

    return res.status(200).cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        domain: "localhost",
        maxAge: 15*60*1000 // 15 mins
    }).cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        domain: "localhost",
        maxAge: 7*24*60*60*1000 // 7 days
    }).json({
        success: true,
        user: user.name,
        message: "Welcome, " + user.name,
        accessToken,
        refreshToken
    })

}

function logout(req, res) {
    res.clearCookie("accessToken", { path: "/", domain: "localhost" });
    res.clearCookie("refreshToken", { path: "/", domain: "localhost" });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
}

// verifying token middleware
function verifyToken(req, res, next) {

    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        return res.status(401).json({
            success: false,
            message: "Access token missing. Login again."
        })
    }
    
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESSTOKEN)
        req.user = decoded.id
        next()
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Acess token expired. Refresh again."
        })
    }

}

function refreshToken(req, res) {

    const token = req.cookies.refreshToken

    if (!token) {

        return res.status(401).json({
            message: "Refresh token missing! Login again."
        })
    }

    

    try {

        const decoded = jwt.verify(token, process.env.JWT_REFRESHTOKEN)

        const newAccessToken = generateAccessToken({id: decoded.id})

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            domain: "localhost",
            maxAge: 15 * 1000 * 60 // 15 min
        })
        return res.status(200).json({
            success: true,
            message: "Refreshed access token."
        })
    } catch (err) {

        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")

        return res.status(403).json({
            message: "You need to log in again!"
        })
    }

}

module.exports = {
    signUp, login, logout, verifyToken, refreshToken
}