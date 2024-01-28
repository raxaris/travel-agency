const travelRouter = require('./routes/travelRouter');
const adminRouter = require('./routes/adminRouter');
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

//travelRouter
app.use('/travel', travelRouter);

//adminRouter
app.use('/admin', adminRouter);
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
app.get('/registration', (req, res) => { 
    res.sendFile(path.join(__dirname, 'view', 'registration.html'));
});

app.post('/registration', (req, res) => { 
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirm = req.body.confirm;
    console.log("Registration request: Login:", username, "Password: ", password);

    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*[@][a-zA-Z0-9]*[\.][a-z]{2,4}$/;
    if(!emailPattern.test(email)){
        return res.status(400).json({status: 'error', message: 'Email does not meet requierments' });
    }
    
    if(!isEmailAvailable(email)){
        return res.status(400).json({status: 'error', message: 'Email is already taken' });
    }

    if(!isUsernameAvailable(username)){
        return res.status(400).json({status: 'error', message: 'Username is already taken' });
    }

    const passwordPattern = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}/
    if(!passwordPattern.test(password)){
        return res.status(400).json({status: 'error', message: 'Password does not meet requierments' });
    }

    if(!(password === confirm)){
        return res.status(400).json({status: 'error', message: 'Passwords do not match' });
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
    console.log("Registered: ", newUser);
    res.json({ status: "success" });
});

//history
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



