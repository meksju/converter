const http = require('http'),
    createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    cors = require('cors');

const PORT = 8001;


let app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://128.1.0.151/converter', {useNewUrlParser: true, useUnifiedTopology: true});

require('./models/Currency');
require('./services/remoteAPIService');

const Currency = mongoose.model('Currency');

Currency.exists({code: 'UAH'}, function(err, result) {
    if (err) {
        console.error(err);
    } else if(!result){
        let hryvnja = new Currency({name:'Українська гривня', rate:1.00, code:'UAH'});
        hryvnja.save();
    }
});


console.log('MongoDB connection has been established');

app.use(require('./routes'));
console.log('Express routes has been initialized');
app.listen(PORT);

console.log('APP is listening on port of', PORT);
module.exports = app;
