const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    id: Number,
    name: String,
    cities: [{
      id: Number,
      name: String,
      hotels: [{
        id: Number,
        name: String,
        price: Number,
        img: String,
        tours: [{
          id: Number,
          dateArrival: String,
          dateDeparture: String,
          adults: Number,
          children: Number
        }]
      }]
    }]
  });

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;
