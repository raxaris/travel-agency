const express = require('express');
const router = express.Router();
const path = require('path');
const data = require('../data.json');
const axios = require('axios');

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
    const { ad: adults, ch: children, country, hotel, city, to: departure, from: arrival } = queryParams;

    return data.countries.reduce((result, currentCountry) => {
        if (!country || currentCountry.name === country) {
            const matchingCities = currentCountry.cities.filter(cityData => {
                return !city || cityData.name === city;
            });

            matchingCities.forEach(matchingCity => {
                const matchingHotels = matchingCity.hotels.filter(hotelData => {
                    return !hotel || hotelData.name === hotel;
                });

                matchingHotels.forEach(matchingHotel => {
                    matchingHotel.tours.forEach(tour => {
                        const datesMatch = (!departure || tour.dateDeparture === departure) &&
                            (!arrival || tour.dateArrival === arrival);

                        const guestsMatch = (!adults || tour.adults === parseInt(adults)) &&
                            (!children || tour.children === parseInt(children));

                        if (datesMatch && guestsMatch) {
                            result.push({
                                country: currentCountry.name,
                                city: matchingCity.name,
                                weather: checkWeather(matchingCity),
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

function checkWeather(city){

}

module.exports = router