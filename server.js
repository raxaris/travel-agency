const express = require('express');
const axios = require('axios')
const cors = require('cors')
const fs = require('fs');
const path = require('path');

const rawData = fs.readFileSync(path.join(__dirname, 'data.json'));
const data = JSON.parse(rawData);   

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get("/search", async (req, res) => {
    try {
        const queryParams = req.query;
        const matchingTours = findMatchingTours(queryParams);

        if (matchingTours.length === 0) {
            res.json({ success: false, message: "No matching tours found" });
        } else {
            res.json({ success: true, data: matchingTours });
        }
    } catch (error) {
        console.error("Error handling /search request:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(port, () => {
    console.log(`Server is running on ${port} port`)
});


function findMatchingTours(queryParams) {
    const { ad: adults, ch: children, country, hotel, city, to: departure, from: arrival} = queryParams;
    const matchingTours = data.countries.reduce((result, currentCountry) => {
        const matchingCities = currentCountry.cities.filter(cityData => cityData.name === city);

        matchingCities.forEach(matchingCity => {
            const matchingHotels = matchingCity.hotels.filter(hotelData =>
                hotelData.name === hotel &&
                hotelData.dateArrival === arrival &&
                hotelData.dateDeparture === departure &&
                hotelData.adults === parseInt(adults) &&
                hotelData.children === parseInt(children)
            );

            matchingHotels.forEach(matchingHotel => {
                result.push({
                    country: currentCountry.name,
                    city: matchingCity.name,
                    hotel: matchingHotel.name,
                    arrival: matchingHotel.dateArrival,
                    departure: matchingHotel.dateDeparture,
                    adults: matchingHotel.adults,
                    childen: matchingHotel.children,
                    price: matchingHotel.price
                });
            });
        });

        return result;
    }, []);

    return matchingTours;
}

