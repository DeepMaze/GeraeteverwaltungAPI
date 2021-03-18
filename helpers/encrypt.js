var bcrypt = require('bcrypt');

var encryptionConfig = require('../environment/encryption');



var encrypt = (data) => {
    return bcrypt.hash(data, encryptionConfig.saltRounds)
        .then((hash) => { return hash; })
        .catch((error) => { console.log(error) });
}


module.exports = encrypt;