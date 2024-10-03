const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
function userMiddleware(req, res, next) {
    // Implement user auth logic
    const token = req.headers.token;
    try{
        const decoded = jwt.verify(token,JWT_SECRET)
        req.userId = decoded.id;
        next();
    }
    catch(e){
        return res.status(404).send("Invalid token");
    }
    
}

module.exports = userMiddleware;