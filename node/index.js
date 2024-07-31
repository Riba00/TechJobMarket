const mongoose = require('mongoose')
require('./config/db')

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const router = require('./routes');
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')

require('dotenv').config({ path: 'variables.env'})

const app = express()

// Enable body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Enable express-validator
app.use(expressValidator());

// Enable handlebars as view engine
app.engine('handlebars',
    exphbs.engine({
        defaultLayout: 'layout',
        helpers: require('./helpers/handlebars')
    })
);

app.set('view engine', 'handlebars')

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser())

const store = MongoStore.create({
    mongoUrl: process.env.DATABASE,
    // Más opciones si es necesario
  });

// Enable session
app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: store
}))

// Alerts and flash messages
app.use(flash())

// Middleware
app.use((req, res, next) => {
    res.locals.messages = req.flash()
    next()
});


app.use('/', router())

app.listen(process.env.PORT);