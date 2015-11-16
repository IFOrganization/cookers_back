
var serverModule = require('./server_setting/module');

var app = serverModule.express();

var middleWare = require('./server_setting/middleware');

var routing = require('./server_setting/route');

var errorHandling = require('./server_setting/errorhandling');

var serverSetting = require('./server_setting/serverrun');

/**
 * middleware setting
 */

middleWare.middlewareSetting(app, serverModule);

/**
 * routes setting
 */

routing.routeSetting(app);

/**
 * errorhandling setting
 */

errorHandling.errorSetting(app);

/**
 * server Start
 */

serverSetting.serverStart(app);


module.exports = app;
/**
 * branch jasung
 */


/**
 * branch sungwoo test
 *
 *
 * sibal
 *
 *
 */
