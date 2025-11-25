const jwt = require("jsonwebtoken")

function generateAccessToken() {

    const secret = process.env.JWT_ACCESSTOKEN
        const payload = {
            id : user._id
        }
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRES
    const token = jwt.sign(payload, secret, { expiresIn: expiresIn})

    return token

}

function generateRefreshToken() {

    const secret = process.env.JWT_REFRESHTOKEN
        const payload = {
            id : user._id
        }
    const expiresIn = process.env.REFRESH_TOKEN_EXPIRES
    const token = jwt.sign(payload, secret, { expiresIn: expiresIn})

    return token

}

module.exports = { generateAccessToken, generateRefreshToken }