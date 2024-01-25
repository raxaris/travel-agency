const express = require('express');
const axios = require('axios')
const cors = require('cors')

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/view/index.html');
});

app.get("/search", async (req, res) => {
    try {
        const queryParams = req.query;
        console.log("Received Query Parameters:", queryParams);

        res.sendStatus(200);
    } catch (error) {
        console.error("Error handling GET request:", error);
        res.sendStatus(500);
    }
});


app.listen(port, () => {
    console.log(`Server is running on ${port} port`)
});