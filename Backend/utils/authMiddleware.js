const jwt = require('jsonwebtoken');
const logger = require("../logger/logger");

// Middleware to verify the JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer token

    if (!token) {
        logger.error("No token provided");
        return res.status(403).json({ error: "Not authenticated" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            logger.error("Failed to authenticate token");
            return res.status(500).json({ error: "Failed to verify token" });
        }
        // Save user id to request for use in other routes
        req.userId = decoded.userid;
        next();
    });
};

module.exports = verifyToken;