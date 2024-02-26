const express = require('express');
const router = express.Router();
const userContoller = require('../controllers/userController')
const path = require('path');
const Role = require('../models/roleModel');
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../view/admin.html'));
})

//create
router.post('/addUser', userContoller.addUser);

//read
router.get('/getUsers', userContoller.getUsers);

router.get('/getUser/:userEmail', userContoller.getUserByEmail);
//update
router.put('/updateUser', userContoller.updateUser);

//delete
router.delete('/deleteUser/:userEmail', userContoller.deleteUser);


router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
});

module.exports = router
