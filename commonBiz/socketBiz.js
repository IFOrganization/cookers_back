/**
 * Created by airnold on 15. 11. 25..
 */

var socket_biz = {};


socket_biz.findSocketId = function( touserid){
    /**
     * 해당하는 모든 아이디가 있는 인덱스 찾아 가져오기
     */

    var finduser = [];

    for(var i in global.userList){
        if(global.userList[i].userid == touserid){
            finduser.push(global.userList[i]);
        }
    }
    return finduser;
};

socket_biz.removeSocketId = function(socketid){
    /**
     * 한개만 삭제하면 됨
     */
    for(var i in global.userList){
        if(global.userList[i].socketid == socketid){
            global.userList.splice(i, 1);
            return;
        }
    }
};

module.exports = socket_biz;