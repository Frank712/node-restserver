const express = require('express');
const app = express();

app.get('/user', function(req, res) {
    res.json('get User Local!!!');
});

app.post('/user', function(req, res) {
    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            message: 'The name is necessary!'
        });
    } else {
        res.json({
            person: body
        });
    }
});

app.put('/user/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/user', function(req, res) {
    res.json('delete User');
});

module.exports = app;