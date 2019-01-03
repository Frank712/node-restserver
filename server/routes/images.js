const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyToken, verifyTokenFromUrl } = require('../middleware/authentication');

let app = express();

app.get('/image/:_type/:img', verifyTokenFromUrl, (req, res)=>{
    let _type = req.params._type;
    let img = req.params.img;

    let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
    let pathImg = path.resolve( __dirname, `../../uploads/${_type}/${img}` );

    fs.existsSync( pathImg ) ? res.sendFile( pathImg ) : res.sendFile( noImagePath );
});

module.exports = app;