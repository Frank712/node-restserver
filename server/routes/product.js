const express = require('express');

const { verifyToken } = require('../middleware/authentication');

let app = express();

let Product = require('../models/product');

// =========================================
//      Show all products
// =========================================
app.get('/product', verifyToken, (req, res) =>{
    let _from = req.query._from || 0;
    _from = Number(_from);
    let limit = req.query.limit || 5;
    limit = Number(limit);
    Product.find({available: true})
        .skip(_from)
        .limit(limit)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, productsDB) => {
            if( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Product.count({ available: true }, (err, counter) => {
                res.json({
                    ok: true,
                    productsDB,
                    counter
                })
            });
        });

});

// =========================================
//      Show a product by ID
// =========================================
app.get('/product/:id', verifyToken, (req, res) =>{
    let id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec( (err, productDB) => {
            if( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if( !productDB ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Product not found!"
                    }
                });
            }
            res.json({
                ok: true,
                productDB
            })
        });
});

// =========================================
//      Create a product
// =========================================
app.post('/product', verifyToken, (req, res) =>{
    let body = req.body;

    let product = new Product({
        user: req.user._id,
        name: body.name,
        priceUni: body.priceUni,
        description: body.description,
        available: body.available,
        category: body.category
    });
    product.save((err, productDB) => {
        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            product: productDB
        });
    });
});

// =========================================
//      Update a product
// =========================================
app.put('/product/:id', verifyToken, (req, res) =>{
    let id = req.params.id;
    let body = req.body;

    Product.findById(id, (err, productDB)=>{
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if( !productDB ){
            return res.status(400).json({
                ok:false,
                err: {
                    message: "The ID isn't valid, product not found"
                }
            });
        };

        productDB.name = body.name;
        productDB.priceUni = body.priceUni;
        productDB.description = body.description;
        productDB.category = body.category;
        productDB.available = body.available;

        productDB.save((err, productSaved)=>{
            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok:true,
                product: productSaved
            })
        });

    });

});

// =========================================
//      Delete a product by ID
// =========================================
app.delete('/product/:id', verifyToken, (req, res) =>{
    let id = req.params.id;

    Product.findById(id, (err, productDB) => {
        if( err ){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if( !productDB ){
            return res.status(400).json({
                ok:false,
                err: {
                    message: "The ID isn't valid, product not found"
                }
            });
        }

        if( productDB.available === false ){
            return res.status(200).json({
                ok:false,
                message: "The product has been deleted previously"
            });
        }

        productDB.available = false;

        productDB.save((err, productSaved)=>{
            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok:true,
                message: "The product has been deleted",
                product: productSaved
            })
        });
    });

});

// =========================================
//      Search products by term
// =========================================
app.get('/product/search/:term', verifyToken, (req, res)=>{
    let term = req.params.term;
    let regex = new RegExp(term, 'i');
    Product.find({name: regex})
        .populate('category', 'description')
        .exec((err, products)=>{
            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                products
            });
        });
});

module.exports = app;