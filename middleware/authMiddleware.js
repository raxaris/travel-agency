const jwt = require("jsonwebtoken");
const {secret} = require("../config");

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS"){
        next();
    }
    try{
        const token = req.session.token;
        if(!token){
            return res.status(403).json({status: "error", message: "Unauthorized"});
        }

        const decodeData = jwt.verify(token, secret)
        req.user = decodeData
        next();
    } catch (e){
        console.log(e);
        return res.status(403).json({status: "error", message: "Unauthorized"});
    }
}