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


let verifyAdminRole = (req, res, next) => {
    let user = req.user;
    if( user.role === 'ADMIN_ROLE' ) {
        console.log(user.role);
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: `The user ${user.name} isn't a ADMINISTRATOR`
            }
        });
    }
};
module.exports = {
    verifyToken,
    verifyAdminRole
};