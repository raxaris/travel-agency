const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authContoller');
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'home.html'));
});
//login
router.get('/login', (req, res) => { 
    res.sendFile(path.join(__dirname, 'view', 'login.html'));
});

router.post('/login', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;
    console.log("Login request: Login:", login, "Password: ", password)

    if(login && password){
        const user = users.find(user => user.username === login || user.email === login);
        if(user){
            if (password === user.password) {
                console.log("User logged");
                if(user.role === 'admin'){
                    res.json({status: 'success', admin : true});
                } else {
                    res.json({status: 'success', admin: false});
                }
            } else {
                res.status(401).json({status: 'error', message: 'Invalid password'});
            }
        } else {
            res.status(401).json({status: 'error', message: 'User was not found :('});
        }
    } else {
        res.status(401).json({status: 'error', message: 'Undefined or null login or password'});
    }
});

//registration
router.get('/registration', (req, res) => { 
    res.sendFile(path.join(__dirname, '..', 'view', 'registration.html'));
});

router.post('/registration', AuthController.registration);


function isUsernameAvailable(login) {
    const lowercasedLogin = login.toLowerCase();
    return !users.some(user => user.username.toLowerCase() === lowercasedLogin);
  }
  
function isEmailAvailable(email) {
    const lowercasedEmail = email.toLowerCase();
    return !users.some(user => user.email.toLowerCase() === lowercasedEmail);
}

module.exports = router