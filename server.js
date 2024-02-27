const travelRouter = require('./routes/travelRouter');
const adminRouter = require('./routes/adminRouter');
const mainRouter = require('./routes/mainRouter');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const {secret} = require('./config');
const helmet = require('helmet');

const app = express();
const port = 3000;
// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//static files
app.use(express.static(__dirname));
//session
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 86400000,
    secure: false } 
}));
//helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "*"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net"],
      scriptSrcAttr: ["'unsafe-inline'"]
    }
  })
);
//travelRouter
app.use('/travel', travelRouter);

//adminRouter
app.use('/admin', adminRouter);

//mainRouter
app.use('/', mainRouter);

//mongodb
mongoose.connect('mongodb://localhost:27017/mongo')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

