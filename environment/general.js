var config = {
    port: 3000,
    environment: 'dev',
    debug: (config.environment == "dev") ? (true) : (false),
    log: true,
    logPath: '../log/',
};

module.exports = config;