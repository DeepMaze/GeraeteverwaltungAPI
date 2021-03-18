var debug = require('debug')('geraeteverwaltungapi:server');



const onListening = (server) => {
    var addr = (server) ? server.address() : '';
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports = onListening;