/**
 * Created by airnold on 15. 11. 25..
 */

var socket_biz = {};


socket_biz.findSocketId = function(list, touserid){
    /**
     * 해당하는 모든 아이디가 있는 인덱스 찾아 가져오기
     */

    var finduser = [];

    for(var i in list){
        if(list[i].userid == touserid){
            finduser.push(list[i]);
        }
    }
    return finduser;
};

socket_biz.removeSocketId = function(list, socketid){
    /**
     * 한개만 삭제하면 됨
     */
    for(var i in list){
        if(list[i].socketid == socketid){
            list.splice(i, 1);
            return list;
        }
    }
};

module.exports = socket_biz;