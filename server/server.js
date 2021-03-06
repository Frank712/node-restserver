require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');

const bodyParser = require('body-parser');
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());
//  Expose Folder Public
app.use( express.static( path.resolve( __dirname, '../public')));
// Global Configuration Routes
app.use( require('./routes/index') );
// DB Connection
mongoose.connect(process.env.URLDB, (err, res) => {
    if( err ) throw err;
    console.log('Base de datos online');
});

app.listen(process.env.PORT, () => {
    console.log('------------------------------------');
    console.log(`Escuchando en puerto ${process.env.PORT}`);
    console.log('------------------------------------');
});