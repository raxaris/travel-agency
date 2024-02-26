const User = require("../models/userModel");
const Role = require("../models/roleModel");
const CustomError = require('../error/customError');
const bcrypt = require('bcryptjs');

class AuthController {
    async registration(req, res)  {
        try{
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;
            const confirm = req.body.confirm;
            console.log("Registration request: Login:");

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
            res.status(400).json({message: "Registration Error"})
        }
    }
}
module.exports = new AuthController();