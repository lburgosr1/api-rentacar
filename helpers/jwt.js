const jwt = require('jsonwebtoken');


const generateJWT = (userId) => {

    return new Promise((resolve, reject) => {
        const payload = {
            userId
        };
    
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => {
    
            if(err) {
                console.log(err);
                reject('No generate JWT', err);
            } else {
                resolve(token);
            }
        });
    });
}

module.exports = {
    generateJWT
}