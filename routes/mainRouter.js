const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authContoller');
const path = require('path');

//main
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'view', 'home.html'));
});
//logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});
//login
router.get('/login', (req, res) => { 
    res.sendFile(path.join(__dirname, '..', 'view', 'login.html'));
});

router.post('/login', AuthController.login);

//registration
router.get('/registration', (req, res) => { 
    res.sendFile(path.join(__dirname, '..', 'view', 'registration.html'));
});

router.post('/registration', AuthController.registration);

module.exports = router