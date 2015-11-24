/**
 * Created by airnold on 15. 10. 16..
 */


var express = require('express');
var router = express.Router();
var cooker_mongo = require('../../../mongoBiz/cookerMongoBiz/cookerMongoBiz/cookermongoBiz.js');
var johayoJwt = require('johayo-jwt');
var nimble = require('nimble');

var serverConfig = require('../../../server_setting/server_config/serverConfig/serverConfig.js');

var ObjectId = require('mongoose').Types.ObjectId;


router.get('/profile', johayoJwt.verify, function (req, res, next) {

    var cooker_profile = {};
    var zimmy_list = [];
    var cooker_zimmy = {};
    var cooker_mycook = {};
    nimble.series([
        function (callback) {

            cooker_mongo.getCookerProfile(req.query.userid, function (profile) {
                cooker_profile = profile;
                callback();
            })
        },
        function (callback) {

            var zimArr = cooker_profile.zimmys;

            for (var i in zimArr) {

                var temp = new ObjectId(zimArr[i]._id);

                zimmy_list.push(temp);
            }

            callback();

            /**
             * 이부분에서 찌미 목록 배열로 만들기
             */

        },
        function (callback) {
            nimble.parallel([
                function (callback) {

                    if (zimmy_list.length == 0) {
                        /**
                         * 그냥 끝내고 넘어가기
                         */

                    } else {
                        /**
                         * cook에서 zimmy 가져오기 zimmy_list 이용
                         */
                        cooker_mongo.getZimmy(zimmy_list, function(zimmy){
                            cooker_zimmy = zimmy;
                            callback();
                        })
                    }
                },
                function (callback) {
                    /**
                     * cook에서 my_cook 가져오기 userid이용
                     */
                    if (cooker_profile.my_cook.length == 0) {
                        /**
                         * 없으니 그냥 끝내고 넘어가기
                         */
                        callback();
                    } else {
                        /**
                         * cook 에서 my_cook 가져오기
                         */
                        cooker_mongo.getMycook(req.query.userid, function(mycook){
                            cooker_mycook = mycook;
                            callback();
                        })
                    }
                }
            ], callback);
        },
        function (callback) {

            var res_data = {};
            res_data.cooker_zimmy = cooker_zimmy;
            res_data.cooker_mycook = cooker_mycook;
            res_data.cooker_profile = cooker_profile;


            res.send(res_data);
            callback();

        }

    ]);

});

router.post('/makefollow', johayoJwt.verify, function (req, res, next) {

    var follow = req.body.data;


    cooker_mongo.makefollow(follow, function(boolean_value){
        res.send(boolean_value);
    });

});

router.post('/cancelfollow', johayoJwt.verify, function (req, res, next) {
    var follow = req.body.data;

    cooker_mongo.cancelfollow(follow, function(boolean_value){
        res.send(boolean_value);
    });
});

router.post('/editprofile', johayoJwt.verify, function (req, res, next) {


    var editdata = req.body.data;

    if(editdata.photo == ''){

        cooker_mongo.editProfile(editdata,'', function(data){
            res.send(data);
        });

    }else{

        var url = 'http://' + serverConfig.server_ip + ':3100';
        var photo = url+"/rest/photo/download/"+editdata.photo;
        cooker_mongo.editProfile(editdata,photo, function(data){
            res.send(data);
        });
    }
});

router.post('/changepwcheck', johayoJwt.verify, function(req,res,next){
    var change_data = req.body.data;
    cooker_mongo.changePasswdCheck(change_data.id, change_data.pw, function(result){
        res.send(result);
    })
});


module.exports = router;
