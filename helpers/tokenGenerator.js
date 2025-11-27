const jwt = require("jsonwebtoken")

function generateAccessToken(payload) {

    const secret = process.env.JWT_ACCESSTOKEN
        
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRES
    const token = jwt.sign(payload, secret, { expiresIn: expiresIn})

    return token

}

function generateRefreshToken(payload) {

    const secret = process.env.JWT_REFRESHTOKEN
        
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRES
    const token = jwt.sign(payload, secret, { expiresIn: expiresIn})

    return token

}

module.exports = { generateAccessToken, generateRefreshToken }