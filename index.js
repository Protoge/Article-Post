const express = require('express');
const app = express();
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
// dotenv 
require('dotenv/config');

// EJS template
app.set('view engine', 'ejs');
app.use(expressLayouts);
// bodyparser json
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(express.static(__dirname + '/public'))


//Connect to DB
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true
}, () => {
    console.log('connected to db')
})

// DB errror
const db = mongoose.connection;
db.on('error', err => console.log(err));


// sessions
app.use(session({
    name: 'sessionId',
    resave: true,
    saveUninitialized: true,
    secret: 'its a secret'
}))

app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Routers
const articleRouter = require('./routes/articleRouter');

app.use('/article', articleRouter);





app.listen(process.env.PORT, () => {
    console.log(`http://localhost:${process.env.PORT}`)
})