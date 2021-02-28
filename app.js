const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const { resolveSoa } = require('dns');

// routes
const userRoutes = require('./routes/users');
const chatroomRoutes = require('./routes/chatrooms');

// connect mongoDB
mongoose.connect('mongodb://localhost:27017/InterNatter', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: 'thisissecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

// initialize and apply passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash middleware
app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes);
app.use('/chatrooms', chatroomRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

// take Error 404 to error handling middleware if an unexist page is visited
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404)); 
});

// error handling middleware
app.use((err, req, res, next) => {
    const {statusCode = 500 } = err;
    if (!err.message) err.message = "No, Something Went Wrong!";
    res.status(statusCode).render('error', {err});
})

// app run at localhost:3000
app.listen(3000, () => {
    console.log("Serving on port 3000");
})