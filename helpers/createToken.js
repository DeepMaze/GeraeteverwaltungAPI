var jwt = require('jsonwebtoken');
var jwtConfig = require('../environment/jsonwebtoken');



const createToken = (userID) => {
    return jwt.sign({ userID }, jwtConfig.privateKey, { algorithm: 'RS256', expiresIn: jwtConfig.expireIn });
};

module.exports = createToken;