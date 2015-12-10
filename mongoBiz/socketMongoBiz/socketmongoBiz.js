/**
 * Created by airnold on 15. 12. 10..
 */

var socket_biz = {};
var ObjectId = require('mongoose').Types.ObjectId;
var mongo = require('../../model/mongoModel.js');

socket_biz.addSocketUser = function(userid, socketid,callback){

    var user_socket = new mongo.model.suserList();

    user_socket.userid = userid;
    user_socket.socketid = socketid;


    user_socket.save(function (err,result) {
        if (err) {
            throw err;
        } else {
            console.log('savesuccess');
            callback(true);
        }
    });

};

socket_biz.findSocketUser = function(userid,callback){
    mongo.model.suserList.find({'userid' : ObjectId(userid)}, function(err, result){
        callback(result);
    })
};

socket_biz.removeSocketUser = function(socketid, callback){

    mongo.model.suserList.remove({'socketid':socketid}, function(err,resp){
        if(err){
            throw err;
        }else{

            callback(true);
        }
    });
};

module.exports = socket_biz;