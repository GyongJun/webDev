const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');

const routes = require('./router');
app.use('/', routes);

const port = 3000;
app.listen(port, () => {
    console.log("Server running on port %s", port);
});