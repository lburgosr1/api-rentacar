const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const dbConnection = async() => {
    try {
        await mongoose.connect(`${process.env.DB_CNN}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database Connected');
    } catch(error) {
        console.log(error);
        throw new Error('Failed to establish connection');
    }
}

module.exports = {
    dbConnection
}