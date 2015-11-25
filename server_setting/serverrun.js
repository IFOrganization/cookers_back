/**
 * Created by airnold on 15. 7. 15..
 */


var http = require('http');
var userList = [];

exports.serverStart = function(app){


    var server = http.createServer(app);
    server.listen(app.get('port'), function(){
        console.log('Cookers server running at ' + app.get('port'));
    });

    var io = require('socket.io').listen(server);

    io.on('connection', function(socket){
        socket.emit('success', '연결 성공 ! ');

        socket.on('add user', function(data){
            /**
             * 현재 userList에 있는지 체크후 저장해주기.
             * @type {{socket: *}}
             */

            userList[data] = {
                "socket" : socket.id
            };
        });
    })

};