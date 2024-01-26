const router = require('./routes/travelRouter');
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const port = 3000;

app.use(express.static(__dirname));

app.use('/travel', router);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'home.html'));
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});