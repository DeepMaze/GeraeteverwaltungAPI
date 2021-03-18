var jwt = require('jsonwebtoken');
var jwtConfig = require('../environment/jsonwebtoken');



const createToken = (userID, userName) => {
    return jwt.sign({ userID: userID, userName: userName }, jwtConfig.privateKey, { algorithm: 'RS256', expiresIn: jwtConfig.expireIn });
};

module.exports = createToken;