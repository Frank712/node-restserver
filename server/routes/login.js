const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Configuration GOOGLE
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    let google_user = await verify(token)
    .catch(e => {
       res.status(403).json({
           ok: false,
           err: e
       })
    });

    User.findOne({ email: google_user.email}, (err, userDB) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if( userDB ){
            if( userDB.google === false ){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'You should use your normal authentication'
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRATE_TOKEN})

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            }
        } else {
            let user = new User();
            user.name = google_user.name;
            user.email= google_user.email;
            user.img = google_user.img;
            user.google = true;
            user.password = ':P';

            user.save((err, userDB) =>{
                if( err ){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.EXPIRATE_TOKEN})

                return res.json({
                    ok: true,
                    user: userDB,
                    token
                });
            });
        }
    });
});

module.exports = app;