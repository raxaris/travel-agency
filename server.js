const router = require('./routes/travelRouter');
const express = require('express');
const app = express();
const logs = require('./logs.json');
const users = require('./users.json');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const port = 3000;
// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//static files
app.use(express.static(__dirname));

//router
app.use('/travel', router);

//routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'home.html'));
});
//login
app.get('/login', (req, res) => { 
    res.sendFile(path.join(__dirname, 'view', 'login.html'));
});

app.post('/login', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;
    const user = users.find(user => user.username === login || user.email === login);

    if (password === user.password) {
        if(user.role === 'admin'){
            res.redirect('/admin')
        } else {res.json({ success: true});}
    } else {
        res.status(401).json({ error: 'Invalid login credentials' });
    }
});

//registration
app.get('/registration', (req, res) => { 
    res.sendFile(path.join(__dirname, 'view', 'registration.html'));
});

app.post('/registration', (req, res) => { 
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirm = req.body.confirm;

    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*[@][a-zA-Z0-9]*[\.][a-z]{2,4}$/;
    if(!emailPattern.test(email)){
        return res.status(400).json({ error: 'Email does not meet requierments' });
    }
    
    if(!isEmailAvailable(email)){
        return res.status(400).json({ error: 'Email is already taken' });
    }

    if(!isUsernameAvailable(username)){
        return res.status(400).json({ error: 'Username is already taken' });
    }

    const passwordPattern = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}/
    if(!passwordPattern.test(password)){
        return res.status(400).json({ error: 'Password does not meet requierments' });
    }

    if(!(password === confirm)){
        return res.status(400).json({ error: 'Passwords do not match' });
    }


    const newUser = {
        id: users.length + 1,
        username: username,
        email: email,
        password: password,
        role: "user"
    };

    users.push(newUser);

    fs.writeFileSync('./users.json', JSON.stringify(users, null, 2));

    res.json({ success: true });
});

//admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'admin.html'));
});

app.get('/history', (req, res) => {
    res.json(logs);
    console.log("Logs were requested.");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

function isUsernameAvailable(login) {
    const lowercasedLogin = login.toLowerCase();
    return !users.some(user => user.username.toLowerCase() === lowercasedLogin);
  }
  
  function isEmailAvailable(email) {
    const lowercasedEmail = email.toLowerCase();
    return !users.some(user => user.email.toLowerCase() === lowercasedEmail);
  }



