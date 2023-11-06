var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

const DOMAIN = 'http://localhost:3000';

var mongoose = require('mongoose')
var session = require('express-session')
var MongoStore = require('connect-mongo')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var lessonsRouter = require('./routes/lessons')
var reviewsRouter = require('./routes/reviews')
var authRouter = require('./routes/auth')
var aiImageRouter = require('./routes/ai-profile-img')
var selectRouter = require('./routes/select-image')
var stripeRouter = require('./routes/stripe');
const Lesson = require('./models/Lesson');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

app.set('trust proxy', 1);
app.enable('trust proxy');

// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').load()
// }

// const stripeSecretKey = process.env.STRIPE_SECRET_KEY
// const stripePublicKey=process.env.STRIPE_PUBLIC_KEY
 
// use session
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 600000 // 60 * 1000 ms === 1 min
    }, // ADDED code below !!!
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI 

      // ttl => time to live
      // ttl: 60 * 60 * 24 // 60sec * 60min * 24h => 1 day
    })
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  if(req.session){
    app.locals.loggedInCreator = req.session.creator
  }
  next()
})

app.use((req, res, next) => {
  if(req.session){
    app.locals.loggedInUser = req.session.user
  }
  next()
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/lessons', lessonsRouter)
app.use('/reviews', reviewsRouter);
app.use('/auth', authRouter);
app.use('/ai-profile-img', aiImageRouter)
app.use('/select-image', selectRouter)
app.use('/stripe', stripeRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

module.exports = app;