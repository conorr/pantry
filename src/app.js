const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const skuController = require('./controllers/skuController');

app.use('/skus', skuController);

app.listen(3000, () => console.log('Example app listening on port 3000!'));