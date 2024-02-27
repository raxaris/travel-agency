const mongoose = require('mongoose');
const fs = require('fs');

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/mongo')
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Чтение данных из JSON файла
    const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    // Определение схемы и модели для коллекции Countries
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

    // Вставка данных в MongoDB
    Country.insertMany(data.countries)
      .then(() => {
        console.log('Data inserted successfully');
        mongoose.connection.close();
      })
      .catch(err => {
        console.error('Error inserting data:', err);
        mongoose.connection.close();
      });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));