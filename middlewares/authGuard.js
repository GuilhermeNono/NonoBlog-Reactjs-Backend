const User = require("../models/User");
const jwt = require('jsonwebtoken');
require("dotenv").config()
const JWT_SECRET = process.env.JWT_SECRET;

const authGuard = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    //Check if header has a token
    if(!token) return res.status(401).json({errors:["Acesso negado!"]});

    //Check if token is valid
    try {
        const verified = jwt.verify(token, JWT_SECRET);
        
        req.user = await User.findById(verified.id).select("-password");

        next();
        } catch (error) {
        res.status(401).json({errors:["Token inválido."]})
    }
}

module.exports = {
    authGuard
}