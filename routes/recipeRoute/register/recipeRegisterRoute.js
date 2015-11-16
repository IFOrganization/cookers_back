/**
 * Created by parkbeomsoo on 2015. 10. 12..
 */
var express = require('express');
var router = express.Router();
var recipeRegistMongoBiz = require('../../../mongoBiz/recipeMongoBiz/register/recipeRegisterMongoBiz.js');
var nimble = require('nimble');

router.post('/', function(req, res, next) {
    var cook = req.body;
    var res_cook = {};
    var res_result = false;
    //var url = "http://localhost:3000";
    var url = 'http://14.63.173.146:3100/rest/photo/download/';
    /**
     *  using nimble - using series.
     *  1. 비동기로 yummy, reply 모델 생성.             -   using parallel
     *  2. 리턴된 결과 값의 yummy_id, reply_id를 이용. cook 객체 생성
     *  3. yummu, reply model에 cook_id update.
     *  4. cook_id 값 리턴.
     */
    nimble.series([
        function(callback){

            nimble.parallel([
                /**
                 * create Yummy
                 * return yummy._id
                 */
                function(callback){

                    recipeRegistMongoBiz.insertYummy(function(y_id){
                        cook.yummy = y_id;
                        callback();
                    });
                },
                /**
                 * create Reply
                 * return reply._id
                 */
                function(callback){

                    recipeRegistMongoBiz.insertReply(function(r_id){
                        cook.reply = r_id;
                        callback();
                    });
                }
            ], callback);
        },
        function(callback){
            /**
             *  create Cook
             *  return cook Object
             */
            recipeRegistMongoBiz.register(cook, function(data){
                cook = data;
                console.log("-----changed_cook ----------");
                console.log(cook);
                console.log("----------------------------");
                callback();
            });

        },
        function(callback){
            nimble.parallel([
                /**
                 * update cook_id In Yummy
                 * return modifyCount.
                 */
                function(callback){
                    recipeRegistMongoBiz.updateCookInYummy(cook.yummy, cook._id, function(result){
                        if(result.nModified==1) res_result = true;
                        else res_result = false;
                        callback();
                    });
                },
                /**
                 * update cook_id In reply
                 * return modifyCount
                 */
                function(callback){
                    recipeRegistMongoBiz.updateCookInReply(cook.reply, cook._id, function(result){
                        if(result.nModified==1) res_result = res_result & true;
                        else res_result = res_result & false;
                        callback();
                    });
                },
                /**
                 * update steps In cook
                 * return modifyCount
                 */
                function(callback){

                    for(var i = 0 ; i < cook.steps.length ; i++){
                        cook.steps[i].photo = url+ cook.steps[i]._id+".png";
                    }

                    cook.comple_photo = cook.steps[cook.steps.length-1].photo;

                    console.log(cook);

                    recipeRegistMongoBiz.updateCookStepPhoto(cook._id, cook.steps, cook.comple_photo,function(result){
                        if(result.nModified==1) res_result = res_result & true;
                        else res_result = res_result & false;
                        callback();
                    });
                },
                /**
                 * update mycook In cooker
                 * return modifyCount
                 */
                function(callback){
                    recipeRegistMongoBiz.updateMyCookInCooker(cook.w_cooker, cook._id, function(result){
                        if(result.nModified==1) res_result = res_result & true;
                        else res_result = res_result & false;
                        callback();
                    });
                }
            ], callback);
        },
        function(callback){
            if(res_result){
                res.send({
                    state : 200,
                    state_comment : "success",
                    _id : cook._id,
                    steps : cook.steps,
                    yummy : cook.yummy,
                    reply : cook.reply
                });
            } else{
                res.send({
                    state : 500,
                    state_comment : "fail",
                    _id : undefined,
                    steps : undefined,
                    yummy : undefined,
                    reply : undefined
                });
            }
            callback();
        }
    ]);



});

router.get('/fail/:cook_id/:yummy_id/:reply_id', function(req, res, next) {
    console.log("register fail !!--------- : "+ req.params.cook_id+ "/"+ req.params.yummy_id+"/"+reply_id);

    nimble.series([
        function(callback){
            nimble.parallel([
                function(callback){
                    recipeRegistMongoBiz.deleteCook(req.params.cook_id, function(result){
                        callback();
                    });
                },
                function(callback){
                    recipeRegistMongoBiz.deleteYummy(req.params.yummy_id, function(result){
                        callback();
                    });

                },
                function(callback){
                    recipeRegistMongoBiz.deleteReply(req.params.reply_id, function(result){
                        callback();
                    });
                }
            ],callback);
        },
        function(callback){
            res.send({
                state : 200,
                state_comment : "Delete cook, yummy, reply"
            })
            callback();
        }
    ]);


});

module.exports = router;
