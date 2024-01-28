const express = require('express');
const router = express.Router();
const path = require('path');
const usersData = require('../users.json');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../view/admin.html'));
})


//create
router.post('/addUser', handleErrorsAsync(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const isEmailTaken = usersData.some(user => user.email === email);
    if (isEmailTaken) {
        return res.status(409).json({ error: 'Email already taken' });
    }

    const newUser = {
        username,
        email,
        password,
    };

    usersData.push(newUser);

    const filePath = path.join(__dirname, '../users.json');
    await writeFile(filePath, JSON.stringify(usersData));

    res.json({ status: 'success', message: 'User added successfully' });
}));

//read
router.get('/getUsers', (req, res) => {
    res.json(usersData);
    console.log("Users were requested.");
});

router.get('/getUser/:userId', (req, res) => {
    const userId = +req.params.userId;

    const user = usersData.find(user => user.id === userId);

    if (user) {
        res.json(user);
        console.log(`User with ID ${userId} was requested.`);
    } else {
        res.status(404).json({ error: 'User not found' });
        console.log(`User with ID ${userId} not found.`);
    }
});
//update
router.put('/updateUser', handleErrorsAsync(async (req, res) => {
    const { email, username, password } = req.body;

    const userIndex = usersData.findIndex(user => user.email === email);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }


    usersData[userIndex].username = username;
    usersData[userIndex].password = password;

    await writeFile(path.join(__dirname, '../users.json'), JSON.stringify(usersData));

    res.json({ status: 'success', message: 'User updated successfully' });
}));

//delete
router.delete('/deleteUser', handleErrorsAsync(async (req, res) => {
    
    const userEmail = req.query.email;

    const users = usersData;

    const updatedUsers = users.filter(user => user.email !== userEmail);

    const filePath = path.join(__dirname, '../users.json');
    await writeFile(filePath, JSON.stringify(updatedUsers));

    res.json({ status: 'success', message: 'User deleted successfully' });
}));

function handleErrorsAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
});

module.exports = router
