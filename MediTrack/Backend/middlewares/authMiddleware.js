const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    // Accept token from common locations: cookie, Authorization header (Bearer or raw), x-auth-token, query param, or body
    let token = req.cookies?.token || req.header("Authorization") || req.header("x-auth-token") || req.query.token || req.body?.token;

    if (!token)
        return res.status(401).json({ msg: "Access denied. No token provided." });

    // If header value is like: "Bearer <token>", strip the prefix
    if (typeof token === "string" && token.toLowerCase().startsWith("bearer ")) {
        token = token.slice(7).trim();
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        return res.status(400).json({ msg: "Invalid token." });
    }
};
