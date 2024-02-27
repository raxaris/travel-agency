const express = require('express');
const router = express.Router();
const userContoller = require('../controllers/userController');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(["ADMIN"]), (req, res) => {
    res.sendFile(path.join(__dirname, '../view/admin.html'));
})

//create
router.post('/addUser', authMiddleware, roleMiddleware(["ADMIN"]), userContoller.addUser);

//read
router.get('/getUsers', authMiddleware, roleMiddleware(["ADMIN"]), userContoller.getUsers);

router.get('/getUser/:userEmail', authMiddleware, roleMiddleware(["ADMIN"]), userContoller.getUserByEmail);``
//update
router.put('/updateUser', authMiddleware, roleMiddleware(["ADMIN"]), userContoller.updateUser);

//delete
router.delete('/deleteUser/:userEmail', authMiddleware, roleMiddleware(["ADMIN"]), userContoller.deleteUser);


router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
});

module.exports = router
