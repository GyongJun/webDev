const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');

const db = require('./config/key').monogoURI;

const config = require('./config/key');
const session = require('express-session');
const flash = require('express-flash');


app.use(session({
    saveUninitialized : true,
    resave : true,
    secret : config.secretOrKey
}));
app.use(flash());


app.use(function(req, res, next) {
    res.locals.session = req.session.user;
    next();
});




mongoose.connect(db)
    .then(() => console.log('monoDB에 접속성공'))
    .catch(err => console.log(err));

const routes = require('./router');
app.use('/', routes);


const posts = require('./router/post');
app.use('/forum', posts);



const port = 3000;
app.listen(port, () => {
    console.log("Server running on port %s", port);
});