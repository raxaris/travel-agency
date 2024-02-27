const User = require("../models/userModel");
const Role = require("../models/roleModel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {secret} = require('../config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"});
}

class AuthController {
    async registration(req, res)  {
        try{
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            const confirm = req.body.confirm;
            console.log("Registration request: Login:", username);
            
            if(!username){
                return res.status(400).json({status: "error", message: "Username cannot be empty", errors})
            }

            if(!(password.length >= 8)){
                return res.status(400).json({status: 'error', message: 'Password must contain more than 8 symbols' });
            }

            if(!(password === confirm)){
                return res.status(400).json({status: 'error', message: 'Passwords do not match' });
            }

            const usernameCandidate = await User.findOne({username});
            if(usernameCandidate){
                return res.status(400).json({status: 'error', message: "User already exists"})
            } 

            const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*[@][a-zA-Z0-9]*[\.][a-z]{2,4}$/;
            if(!emailPattern.test(email)){
                return res.status(400).json({status: 'error', message: 'Email does not meet requierments' });
            }
            
            const emailCandidate = await User.findOne({email});
            if(emailCandidate){
                return res.status(400).json({status: 'error', message: 'Email is already taken' });
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"});
            const user = new User({username, email, password: hashPassword, roles: [userRole.value]})
            
            await user.save();
            console.log("Registration successful: Login:", username);
            return res.status(200).json({status: 'success', message: 'User sucessfully registered'});
        } catch (e) {
            console.log(e);
            res.status(400).json({status: "error", message: "Registration Error"})
        }
    }

    async login(req, res){
        try{
            const username = req.body.username;
            const password = req.body.password;
            console.log("User", username, "trying to login")
            const user = await User.findOne({username});
            if (!user){
                return res.status(404).json({status: "error", message : `User ${username} was not found`});
            }

            const validPassword = bcrypt.compareSync(password, user.password);
            if(!validPassword){
                return res.status(400).json({status: "error", message : `Invalid password`});
            }
            
            const token = generateAccessToken(user._id, user.roles);
            req.session.token = token;
            console.log(token, "User logged in")
            return res.status(200).json({status: "success", token});
        } catch (e){
            console.log(e);
            res.status(400).json({status: "error", message : "Login Error"})
        }
    }
}
module.exports = new AuthController();