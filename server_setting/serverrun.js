/**
 * Created by airnold on 15. 7. 15..
 */


var http = require('http');
var userList = [];
var socket_biz = require('../commonBiz/socketBiz.js');

exports.serverStart = function(app){

    var server = http.createServer(app);
    server.listen(app.get('port'), function(){
        console.log('Cookers server running at ' + app.get('port'));
    });


    /**
     * socket 코딩 부분
     */

    var io = require('socket.io').listen(server);

    io.on('connection', function(socket){
        socket.emit('success', '연결 성공 !');

        socket.on('add user', function(data){

            var temp =  {};
            temp.socketid = socket.id;
            temp.userid = data;
            userList.push(temp);

        });

        socket.on('notipush', function(touserid){
            /**
             * user id 현재 접속되어있는지 찾기
             */

            var sendlist = socket_biz.findSocketId(userList, touserid);

            if(sendlist.length == 0){
                /**
                 * 접속되있지 않음 apn, gcm 사용
                 */
            }else{
                /**
                 * 접속되어있음 보내야 함
                 */

                for(var i in sendlist){
                    io.to(sendlist[i].socketid).emit('badgenoti', '!');
                }
            }
        });

        socket.on('disconnect', function(){

            userList = socket_biz.removeSocketId(userList, socket.id);
            console.log(socket.id);
            /**
             * socket.id 에 해당하는 객체 삭제 해주기
             */

        });
    })

};