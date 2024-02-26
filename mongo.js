const express = require('express');
const mongoose = require('mongoose');
const User = require('./userModel');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect('mongodb://localhost:27017/mongo')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './view/admin.html'));
});

app.post('/addUser', handleErrorsAsync(async (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.json({ status: 'success', message: 'User added successfully' });
}));

app.get('/getUsers', handleErrorsAsync(async (req, res) => {
    const users = await User.find();
    res.json(users);
    console.log("Users were requested.");
}));

app.get('/getUser/:userEmail', handleErrorsAsync(async (req, res) => {
    const userEmail = req.params.userEmail;
    const user = await User.findByEmail(userEmail);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
    } else {
        res.json(user);
    }
}));

app.put('/updateUser', handleErrorsAsync(async (req, res) => {
    const { username, email, password } = req.body;
    
    const user = await User.findByEmail(email);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    user.username = username;
    user.email = email;
    user.password = password;
    await user.save();
    res.json({ status: 'success', message: 'User updated successfully' });
}));

app.delete('/deleteUser/:userEmail', handleErrorsAsync(async (req, res) => {
    const userEmail = req.params.userEmail;

    try {
        const deletedUser = await User.findOneAndDelete({ email: userEmail });
        if (!deletedUser) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({ status: 'success', message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}));

function handleErrorsAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
