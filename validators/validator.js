const { validationResult } = require("express-validator")

module.exports = (req, res, next) => {
    const err = validationResult(req);

    if (!err.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: err.array()
        });
    }

    next();
};