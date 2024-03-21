require('dotenv').config();
const path = require('path');

const express = require('express');
const cors = require('cors');

const cron = require('node-cron');

const { dbConnection } = require('./database/config');

//Create express server
const app = express();

//Config CORS
app.use(cors());

//Public File
app.use(express.static('public'));

//Read and parse Body
app.use(express.json());

//DB
dbConnection();

//Routes
app.use('/api/user', require('./routes/user.route'));
app.use('/api/login', require('./routes/auth.route'));

app.use('/api/user-name-validator', require('./routes/user-name-validator.route'));

app.use('/api/customer', require('./routes/customer.route'));
app.use('/api/employee', require('./routes/employee.route'));
app.use('/api/vehicle', require('./routes/vehicle.route'));
app.use('/api/type-vehicle', require('./routes/type-vehicle.route'));
app.use('/api/rent-a-car', require('./routes/rent-a-car.route'));
app.use('/api/document', require('./routes/document.route'));
app.use('/api/company', require('./routes/company.route'));
app.use('/api/coin', require('./routes/coin.route'));
app.use('/api/brand-vehicle', require('./routes/brand-vehicle.route'));
app.use('/api/vehicle-model', require('./routes/vehicle-model.route'));

app.use('/api/searchAll', require('./routes/search-all.route'));

app.use('/api/upload', require('./routes/upload.route'));

app.use('/api/invoice', require('./routes/invoice.route'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
})

app.listen(process.env.PORT, () => {
    console.log(`Server connected on port ${process.env.PORT}`);
});


cron.schedule('0 1 * * *', () => {
    updatePolicyAuto();
});

/* 
var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));
*/