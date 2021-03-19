var jwt = require('jsonwebtoken');

var { createLog } = require('../helpers/logging');

var generalConfig = require('./environment/general');
var jwtConfig = require('../environment/jsonwebtoken');



const createToken = (userID, ip) => {
    var token = jwt.sign({ userID }, jwtConfig.privateKey, { algorithm: 'RS256', expiresIn: jwtConfig.expireIn });
    if (generalConfig.log) { createLog({ type: 'tokenCreated', params: { userID, ip } }); }
    return token;
};

module.exports = createToken;