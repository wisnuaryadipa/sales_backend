

const { ENV, PORT, MONGO_ATLAS_DBNAME, MONGO_ATLAS_PW, MONGO_ATLAS_USERNAME} = require('./config');
const express = require('express')
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express()

var routes = require('./routes/router.js');

console.log(ENV);
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS ALL ACCESS
app.use(cors());

app.use('/', routes);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

app.listen(PORT, () => {
  console.log('Connect into PORT '+PORT)
});
  