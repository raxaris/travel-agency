const express = require('express');
const axios = require('axios')
const cors = require('cors')

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "index.html")
})

app.listen(port, () => {
    console.log(`Server is running on ${port} port`)
})