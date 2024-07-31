const mongoose = require('mongoose')
require('dotenv').config({path: 'variables.env'})

mongoose.connect(process.env.DATABASE)

mongoose.connection.on('error', (error) => {
    console.log(error);
})

require('../models/Vacancies')
require('../models/Users')