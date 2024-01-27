const router = require('./routes/travelRouter');
const express = require('express');
const app = express();
const logs = require('./logs.json');
const path = require('path');
const bodyParser = require('body-parser');
const { log } = require('console');

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

app.get('/login', (req, res) => { 
    res.sendFile(path.join(__dirname, 'view', 'login.html'));
});

app.post('/login', (req, res) => {
    const login = req.body.login;
    const password = req.body.password;
    console.log("login:", login, "pass: ",password);
    if (login === 'admin' && password === 'admin') {
        res.redirect('/admin');
    } else {
        res.send('Login failed');
    }
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'admin.html'));
});

app.get('/history', (req, res) => {
    res.json(logs);
    console.log("Logs were requested.")
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});