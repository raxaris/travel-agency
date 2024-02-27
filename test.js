const jwt = require('jsonwebtoken');
const { secret } = require('./config'); 

const token = "s%3AfCJME3N2Bhm8ZHD9TqCcIiAv2SVLC1or.sTQ0dtw9WaQCZYJIgMhlHVaWCu%2FL7YhZdPtqABUnEIQ"; 

// Декодируем токен
jwt.verify(token, secret, (err, decoded) => {
    if (err) {
        console.error('Ошибка при декодировании токена:', err);
    } else {
        console.log('Декодированный токен:', decoded);
    }
});