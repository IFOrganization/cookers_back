var useModule = {};
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var domain = require('express-domain-middleware');
var cors = require('cors');
var johayoJwt = require('johayo-jwt');
var model = require('./model/mongoModel_pre.js');
var http = require('http');
var socket_biz = require('./mongoBiz/socketMongoBiz/socketmongoBiz.js');
var app = express();

var routing = require('./server_setting/route');
var errorHandling = require('./server_setting/errorhandling');

/**
 * middleware setting
 */

// view engine setup
app.set('port', process.env.PORT || 3100);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
/*app.use(serverModule.favicon(__dirname + '/public/favicon.ico'));*/
app.use(cors());
app.use(domain);
app.use(logger('dev'));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cookieParser());
app.use(johayoJwt({
    /* jwt 토큰의 데이터부분을 한번더 암호화 할때 쓰는 암호화키 */
    tokenSecret: "makeyouriftoken",
    /* jwt 자체 암호화 키 */
    jwtSecret: "makeyourifjwt",
    /* jwt 암호화 알고리즘(디폴트: HS256)  */
    algorithm: "HS256",
    /* 만료시간 초단위 (디폴트: 3600 - 1시간) */
    /*expireTime: 3600,*/
    /* 복호화 한후 정보 저장위치(디폴트: req.user) */
    userProperty: "user"
}));
app.use(express.static(path.join(__dirname, '../public')));

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

        console.log(data);
        console.log(socket.id);

        socket_biz.addSocketUser(data, socket.id, function(issuccess){
            console.log(issuccess);

            socket_biz.findSocketUser(data, function(result){
                console.log(result);
            });
        });

    });

    socket.on('notipush', function(touserid){

        socket_biz.findSocketUser(touserid, function(usersendList){
            if(usersendList.length == 0){
                /**
                 * 접속되있지 않음 apn, gcm 사용
                 */
            }else{
                /**
                 * 접속되어있음 보내야 함
                 */

                for(var i in usersendList){
                    io.to(usersendList[i].socketid).emit('badgenoti', '!');
                }
            }
        });

    });

    socket.on('disconnect', function(){

        socket_biz.removeSocketUser(socket.id, function(issuccess){
            console.log(issuccess);
        });

        /**
         * socket.id 에 해당하는 객체 삭제 해주기
         */

    });
});



module.exports = app;
