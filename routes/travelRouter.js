const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios');
const Country = require('../models/countryModel');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../view/index.html'));
})

router.get("/search", async (req, res) => {
    try {
        const queryParams = req.query;
        const matchingTours = await findMatchingTours(queryParams);

        if (matchingTours.length === 0) {
            res.json({ success: false, message: "No matching tours found" });
        } else {
            res.json(matchingTours);
        }
    } catch (error) {
        console.error("Error handling /search request:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/data', async (req, res) => {
    try {
        const countries = await Country.find().lean();
        res.json(countries); 
        console.log("Data was requested.");
    } catch (error) {
        console.error("Error handling /data request:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/tours', (req, res) => {
    const queryParams = req.query;
    console.log('query: ', queryParams);
    res.sendFile(path.join(__dirname, '../view/search.html'));
});

router.get('/weather', async (req, res) => {
    try {
        const apiKey = '7f1beacb3f1e4513aef90038241901';
        const city = req.query.city;
        
        if (!city) {
            return res.status(400).json({ error: 'City parameter is required' });
        }

        const units = 'metric';

        const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&units=${units}&q=${city}`);
        const data = response.data;

        const weatherData = {
            temperature: data.current.temp_c,
            condition: configureCondition(data.current.condition.text)
        };
        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function findMatchingTours(queryParams) {
    try {
        let query = {};

        if (queryParams.country) {
            query['name'] = queryParams.country;
        }

        if (queryParams.city) {
            query['cities.name'] = queryParams.city;
        }

        if (queryParams.hotel) {
            query['cities.hotels.name'] = queryParams.hotel;
        }

        if (queryParams.departure) {
            query['cities.hotels.tours.dateDeparture'] = queryParams.departure;
        }

        if (queryParams.arrival) {
            query['cities.hotels.tours.dateArrival'] = queryParams.arrival;
        }

        if (queryParams.adults) {
            query['cities.hotels.tours.adults'] = parseInt(queryParams.adults);
        }

        if (queryParams.children) {
            query['cities.hotels.tours.children'] = parseInt(queryParams.children);
        }

        const matchingTours = await Country.aggregate([
            { $unwind: "$cities" },
            { $unwind: "$cities.hotels" },
            { $unwind: "$cities.hotels.tours" },
            { $match: query },
            {
                $project: {
                    _id: 0,
                    country: "$name",
                    city: "$cities.name",
                    hotel: "$cities.hotels.name",
                    arrival: "$cities.hotels.tours.dateArrival",
                    departure: "$cities.hotels.tours.dateDeparture",
                    adults: "$cities.hotels.tours.adults",
                    children: "$cities.hotels.tours.children",
                    price: { $multiply: ["$cities.hotels.price", { $add: ["$cities.hotels.tours.adults", { $multiply: ["$cities.hotels.tours.children", 0.5] }] }] },
                    img: "$cities.hotels.img"
                }
            }
        ]);

        console.log(matchingTours);
        return matchingTours;
    } catch (error) {
        console.error("Error finding matching tours:", error);
        throw error;
    }
}

function calculatePrice(hotel, adults, children) {
    const hotelPrice = parseInt(hotel.price);
    const totalPrice = hotelPrice * (parseInt(adults) + parseInt(children) * 0.5);
    return totalPrice;
}

function configureCondition(condition) {
    condition = condition.toLowerCase();

    if (condition.includes("snow")) {
        return "&#x1F328";
    } else if (condition.includes("mist") || condition.includes("fog")) {
        return "&#x1F32B;";
    } else if (condition.includes("sunny") || condition.includes("clear")) {
        return "&#x2600";
    } else if (condition.includes("cloud") || condition.includes("overcast")) {
        return "&#x2601";
    } else if (condition.includes("rain") || condition.includes("thunder")) {
        return "&#x1F327;";
    } else {
        return "&#x2600";
    }
}

module.exports = router