const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

app.post('/login', (req, res) => {
    let body = req.body;
    User.findOne({email: body.email}, (err, userDB) => {
       if( err ){
           return res.status(500).json({
               ok: false,
               err
           });
       }
       if( !userDB ){
           return res.status(400).json({
               ok: false,
               err: {
                   message: '(User) and/or password incorrect'
               }
           });
       }
       if( !bcrypt.compareSync( body.password, userDB.password ) ){
           return res.status(400).json({
               ok: false,
               err: {
                   message: 'User and/or (password) incorrect'
               }
           })
       }
       let token = jwt.sign({
           user: userDB
       }, process.env.SEED, { expiresIn: process.env.EXPIRATE_TOKEN });

       res.json({
           ok: true,
           userDB,
           token
       });
    });
});

module.exports = app;