const express = require('express');

let { verifyToken, verifyAdminRole } = require('../middleware/authentication');

let app = express();

let Category = require('../models/category');

// =========================================
//      Show all categories
// =========================================
app.get('/category', verifyToken, (req, res)=>{

    Category.find({})
        .exec((err, categoriesDB) =>{
            if( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoriesDB
            });
        });
});

// =========================================
//      Show a category by ID
// =========================================
app.get('/category/:id', verifyToken, (req, res)=>{
    let id = req.params.id;
    Category.findById(id, (err, categoryDB)=>{
        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoryDB
        })
    });
});

// =========================================
//      Create a category
// =========================================
app.post('/category', verifyToken, (req, res) => {
    // Return a new category
    // req.user._id
    let body = req.body;
    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save((err, categoryDB)=>{
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if( !categoryDB ){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            category: categoryDB
        });
    });
});

// =========================================
//      Edit a category
// =========================================
app.put('/category/:id', verifyToken, (req, res)=>{
    let id = req.params.id;
    let body = req.body;
    let descCategory = {
        description: body.description
    };

    Category.findByIdAndUpdate(id, descCategory, { new : true, runValidators: true}, (err, categoryDB) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if( !categoryDB ){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            category: categoryDB
        });
    } );


});

// =========================================
//      Delete a category
// =========================================
app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res)=>{
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => {
        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if( !categoryDB ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: "The ID doesn't exist"
                }
            });
        }
        return res.json({
            ok: true,
            message: "The category has been deleted!",
            category: categoryDB
        });
    });

});

module.exports = app;