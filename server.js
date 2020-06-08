const hateoasLinker = require('express-hateoas-links');
const expressValidator = require('express-validator');
const node = require('./resources/bootstrap');
const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const cors = require("cors");

const app = express();

app.use(expressValidator());
app.use(bodyParser.json());
app.use(hateoasLinker);
app.use(helmet());
app.use(cors());

app.listen(5200, () => {
    console.log(`Server beží na porte ${5200}`)
});