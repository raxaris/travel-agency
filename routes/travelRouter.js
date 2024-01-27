const express = require('express');
const router = express.Router();
const path = require('path');
const data = require('../data.json');
const axios = require('axios');
const fs = require('fs');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../view/index.html'));
})

router.get("/search", async (req, res) => {
    try {
        const queryParams = req.query;
        const matchingTours = findMatchingTours(queryParams);

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

router.get('/data', (req, res) => {
    res.json(data);
    console.log("Data was requested.")
});

router.get('/tours', (req, res) => {
    const queryParams = req.query;
    console.log('query: ', queryParams);
    saveHistoryLog(queryParams);
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
            condition: data.current.condition.text
        };

        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function findMatchingTours(queryParams) {
    return data.countries.reduce((result, currentCountry) => {
        if (!queryParams.country || currentCountry.name === queryParams.country) {
            const matchingCities = currentCountry.cities.filter(cityData => {
                return !queryParams.city || cityData.name === queryParams.city;
            });

            matchingCities.forEach(matchingCity => {
                const matchingHotels = matchingCity.hotels.filter(hotelData => {
                    return !queryParams.hotel || hotelData.name === queryParams.hotel;
                });

                matchingHotels.forEach(matchingHotel => {
                    matchingHotel.tours.forEach(tour => {
                        const datesMatch = (!queryParams.departure || tour.dateDeparture === queryParams.departure) &&
                            (!queryParams.arrival || tour.dateArrival === queryParams.arrival);

                        const guestsMatch = (!queryParams.adults || tour.adults === parseInt(queryParams.adults)) &&
                            (!queryParams.children || tour.children === parseInt(queryParams.children));

                        if (datesMatch && guestsMatch) {
                            result.push({
                                country: currentCountry.name,
                                city: matchingCity.name,
                                hotel: matchingHotel.name,
                                arrival: tour.dateArrival,
                                departure: tour.dateDeparture,
                                adults: tour.adults,
                                children: tour.children,
                                price: calculatePrice(matchingHotel, tour.adults, tour.children),
                                img: matchingHotel.img
                            });
                        }
                    });
                });
            });
        }

        return result;
    }, []);
}

function calculatePrice(hotel, adults, children) {
    const hotelPrice = parseInt(hotel.price);
    const totalPrice = hotelPrice * (parseInt(adults) + parseInt(children) * 0.5);
    return totalPrice;
}

function saveHistoryLog(query){
    const date = Date.now().toString();
    const logData = {
        date: date,
        data: query,
    };

    let logs = [];
    try {
        const logsFile = fs.readFileSync('logs.json', 'utf8');
        logs = JSON.parse(logsFile);
    } catch (error) {
        console.error('Error reading logs:', error.message);
    }

    logs.push(logData);

    fs.writeFileSync('logs.json', JSON.stringify(logs, null, 2), 'utf8');
}

module.exports = router