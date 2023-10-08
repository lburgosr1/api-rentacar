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
app.use('/api/users', require('./routes/users.route'));
app.use('/api/login', require('./routes/auth.route'));

app.use('/api/customer', require('./routes/customer.route'));

app.use('/api/searchAll', require('./routes/search-all.route'));
app.use('/api/upload', require('./routes/upload.route'));

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