var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var MongoStore = require("connect-mongo")(session);
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');
var multer = require('multer');
var methodOverride = require('method-override');

app.user
require('./passport/local-auth')(passport);
const https = require('https');
// database//
const URI='mongodb+srv://Restorant:accessdb@cluster0.qjqtf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(db => console.log('base de datos conectada'))
  .catch(err => console.log(err));


// Middelwares
app.use(multer({
  dest: path.join(__dirname, 'public/uploads'),
  storage: storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {

      cb(null, file.originalname);
    }

  }),

}).single('image'));

// app.use(session({
//   secret: 'restorantesession',
//   resave: false,
//   saveUnitialized: false
// }));

app.use(flash());
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(
  function (req, res, next) {
    res.locals.user = req.user || null;
    res.locals.session = req.session;
    next();
  });

//Variables globales

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  cookie: {
    maxAge: 180 * 60 * 1000
  }
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use(cookieParser());
app.use(require('./routes/index'));
app.use(require('./routes/menu.routes'));
// app.use(require('./controllers/imagen.controllers'));
app.use(require('./routes/platillo.routes'));
app.use(require('./routes/users.routes'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(require(usersRouter));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;




