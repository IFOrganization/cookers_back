/**
 * Created by airnold on 15. 7. 15..
 */


var http = require('http');

exports.serverStart = function(app){

    http.createServer(app).listen(app.get('port'), function () {

        console.log('Cookers server running at ' + app.get('port'));

    });
};