/**
 * Created by parkbeomsoo on 2015. 10. 12..
 */
var express = require('express');
var router = express.Router();
var noticeMongoBiz = require('../../mongoBiz/noticeMongoBiz/noticeMongoBiz.js');


var mongo = require('../../model/mongoModel.js');
var ObjectId = require('mongoose').Types.ObjectId;

router.post('/save', function(req, res, next) {
    console.log("~~~  notice save rest  ~~~~");

    noticeMongoBiz.notice_insert(req.body, function(data){
        res.send(data);
    });
});

router.get('/:user_id', function(req, res, next) {

    console.log("/notice/user_id");

    noticeMongoBiz.findNotices(req.params.user_id, function(data){
        console.log(data);
        res.send(data);
    });
});

router.get('/confirm/:notice_id', function(req, res, next) {

    console.log("/notice/confirm/"+req.params.notice_id);

    noticeMongoBiz.updateNoticeState(req.params.notice_id, function(data){
        console.log(data);
        if(data.nModified == 1){
            res.send({
                state : 200,
                state_comment : "success"
            });
        }else{
            res.send({
                state : 500,
                state_comment : "db update err"
            });
        }

    });
});

module.exports = router;

