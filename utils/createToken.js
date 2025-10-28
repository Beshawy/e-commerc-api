const jwt = require ('jsonwebtoken') ;
const createToken = (payload) =>{
    return jwt.sign (payload , config.jwtSecret , {expiresIn : config.jwtExpiresIn}) ;
}


module.exports = createToken ;