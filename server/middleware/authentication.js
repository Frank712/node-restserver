const jwt = require('jsonwebtoken');
//========================
//  Verify TOKEN
//========================
let verifyToken = (req, res, next) => {
    let token = req.get('Authorization');
    /*res.json({
        token
    });*/
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.user = decoded.user;
        next();
    });
};

module.exports = {
    verifyToken
};