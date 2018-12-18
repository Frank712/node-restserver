const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

const { verifyToken } = require('../middleware/authentication');
const User = require('../models/user');

app.get('/user', verifyToken, (req, res) => {
    return res.json({
        user: req.user,
        name: req.user.name,
        email: req.user.email
    });

    let since = req.query.since || 0;
    since = Number(since);
    let limit = req.query.limit || 5;
    limit = Number(limit);
    User.find({ status: true }, 'name email role status img google')
        .skip(since)
        .limit(limit)
        .exec( (err, users) => {
            if( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            User.count({ status: true }, (err, counter) => {
                res.json({
                    ok: true,
                    users,
                    counter
                })
            });

        });
});

app.post('/user', verifyToken, function(req, res) {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        password:  bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if( err ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Token invalid'
                }
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.put('/user/:id', verifyToken, function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);
    User.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, userDB)=>{
        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            userDB
        });
    });

});

app.delete('/user/:id', verifyToken, function(req, res) {
    let id = req.params.id;
    /*User.findByIdAndUpdate(id, {status: false}, {new: true}, (err, userDel)=>{
        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if( !userDel ) {
            return res.json({
                ok: false,
                err: {
                    message: 'User not found!'
                }
            });
        }
        if( userDel.status === false ){
            return res.json({
                ok: true,
                message: `The user with id ${id} has been previously deleted`
            })
        }
        res.json({
            ok: true,
            userDel
        });
    });*/
    User.findById( id, ( err, userDB ) => {
        if( err ) {
            return res.status(400).json({
               ok: false,
               err
            });
        }
        if( !userDB ) {
            return res.status(400).json({
                ok: false,
                message: 'User not found'
            });
        }
        if( userDB.status === false ){
            return res.json({
                ok: true,
                message: `The user with id ${id} has been previously deleted`
            })
        }
        let user = new User( userDB );
        user.status = false;
        user.save( (err, userDel) => {
            if( err ){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                message: 'User deleted',
                userDel
            });
        });
    });
});

module.exports = app;