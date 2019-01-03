const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const User = require('../models/user');
const Product = require('../models/product');

app.use(fileUpload());

app.put('/upload/:_type/:id', (req, res) =>{
    let _type = req.params._type;
    let id = req.params.id;

    if( !req.files ){
        return res.status(400).json({
            ok: false,
            err: {
                message: "No files were uploaded"
            }
        });
    }
    //  Validate type
    valid_types = ['products', 'users'];

    if( valid_types.indexOf(_type) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "The type isn't valid! The permitted types are: " + valid_types.join(', '),
                type_received: _type
            }
        });
    }

    let fileUp = req.files.filesToUp;
    let filename_components = fileUp.name.split('.');
    let extension = filename_components[ filename_components.length -1 ];

    let valid_extensions = ['png', 'jpg', 'gif', 'jpeg'];

    if( valid_extensions.indexOf(extension) < 0 ) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "The extension isn't valid! The permitted extensions are: " + valid_extensions.join(', '),
                extension_received: extension
            }
        });
    }
    //  change name to file
    let newNameFile = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;

    fileUp.mv(`uploads/${_type}/${newNameFile}`, (err) =>{
       if( err ){
           return res.status(500).json({
              ok: false,
              err
           });
       }

       if( _type === 'users' )
           imageUser(id, res, newNameFile);
       else
           imageProduct(id, res, newNameFile);
    });

});

function imageUser(id, res, fileName){
    User.findById(id, (err, userDB) => {
        if( err ){
            deleteFile( fileName, 'users');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if( !userDB ){
            deleteFile( fileName, 'users');
            return res.status(400).json({
                ok: false,
                err: {
                    message: "User doesn't exist"
                }
            });
        }

        deleteFile( userDB.img, 'users');

        userDB.img = fileName;
        userDB.save( (err, userSaved) =>{
            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                userSaved,
                img: fileName
            });
        });
    });
}

function imageProduct(id, res, fileName){
    Product.findById(id, (err, productDB) => {
        if( err ){
            deleteFile( fileName, 'products');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if( !productDB ){
            deleteFile( fileName, 'products');
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Product doesn't exist"
                }
            });
        }

        deleteFile( productDB.img, 'products');

        productDB.img = fileName;
        productDB.save( (err, productSaved) =>{
            if( err ){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productSaved,
                img: fileName
            });
        });
    });
}

function deleteFile(img_name, _type){
    let path_img = path.resolve(__dirname, `../../uploads/${_type}/${ img_name }`);
    if( fs.existsSync(path_img) ){
        fs.unlinkSync(path_img);
    }
}

module.exports = app;