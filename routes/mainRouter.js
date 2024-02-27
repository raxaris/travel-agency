const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authContoller');
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'view', 'home.html'));
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