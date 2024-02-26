const User = require("../models/userModel")

class UserController {
    async addUser(req, res) {
        try {
            const { username, email, password } = req.body;
            
            const usernameCandidate = await User.findOne({username});
            if(usernameCandidate){
                return res.status(400).json({status: 'error', message: "User already exists"})
            }

            const emailCandidate = await User.findOne({email});
            if(emailCandidate){
                return res.status(400).json({status: 'error', message: 'Email is already taken' });
            }

            const hashPassword = bcrypt.hashSync(password, 7);

            const userRole = await Role.findOne({value: "USER"});
            const user = new User({username, email, hashPassword, roles: [userRole.value]})
            await user.save();

            res.json({ status: 'success', message: 'User added successfully' });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    async getUsers(req, res){
        try {
            const users = await User.find();
            res.json(users);
            console.log("Users were requested.");
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    async getUserByEmail(req, res) {
        try{
            const userEmail = req.params.userEmail;
            const user = await User.findByEmail(userEmail);
            if (!user) {
                return res.status(404).json({ status: 'error', message: 'User not found' });
            } else {
                res.json(user);
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    async updateUser(req, res) {
        try{   
            const { username, email, password } = req.body;
            
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(404).json({ status: 'error', message: 'User not found' });
            }
            user.username = username;
            user.email = email;
            user.password = password;
            await user.save();
            res.json({ status: 'success', message: 'User updated successfully' });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    async deleteUser(req, res) {
        try {
            const userEmail = req.params.userEmail;
            const deletedUser = await User.findOneAndDelete({ email: userEmail });
            if (!deletedUser) {
                return res.status(404).json({ status: 'error', message: 'User not found' });
            }
            res.json({ status: 'success', message: 'User deleted successfully' });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

}

module.exports = new UserController();