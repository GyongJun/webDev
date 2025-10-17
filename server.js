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

mongoose.connect(db)
    .then(() => console.log('monoDB에 접속성공'))
    .catch(err => console.log(err));

const routes = require('./router');
app.use('/', routes);

const port = 3000;
app.listen(port, () => {
    console.log("Server running on port %s", port);
});