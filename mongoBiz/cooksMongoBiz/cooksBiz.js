/**
 * Created by kimsungwoo on 2015. 10. 11..
 */

var mongo = require('../../model/mongoModel.js');
var cooksFunc = {};
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var nimble = require('nimble');

cooksFunc.getcooksbymyFollowing = function(following_list, callback){
    /**
     * 1. 내가 팔로잉중인 유저의 리스트 출력
     * 2. 유저 리스트를 통해 레시피 각각 검색후 최신순으로 정렬
     */


    var cook_list = [];
    var temp;

    for(var i in following_list){
        temp = new ObjectId(following_list[i]);
        cook_list.push(temp);
    }

    //$in 연산자를 통해 cook의 작성자 id와 내가 팔로잉중인 유저의 id를 비교
    mongo.model.cook.find(
        {
            'w_cooker': { $in: cook_list}
        },
        {
            complete_photo:1,
            desc:1,
            hits:1,
            date:1,
            reply:1,
            title:1,
            w_cooker:1,
            yummy:1
        }).exec(function(err, docs) {
            mongo.model.cooker.populate(docs, { path: 'w_cooker', select: 'nick_name cooker_photo'}, function (err, w_cooker_result) {
                if (err) {
                    throw err;
                } else {
                    mongo.model.yummy.populate(w_cooker_result, {path: 'yummy', select: 'cookers'}, function (err, yummy_result) {
                        if (err) {
                            throw err;
                        } else {
                            mongo.model.reply.populate(yummy_result, {path: 'reply', select: 'cookers'}, function (err, reply_result) {
                                if (err) {
                                    throw err;
                                } else {
                                    callback(reply_result);
                                }
                            })
                        }
                    })
                }
            });
        });
}

cooksFunc.getcookstepbyCookid = function(cook_id, callback){
    /**
     * 1. 전달 받은 cook_id로 해당 쿡의 스텝정보를 가져옴.
     */

    var obj_id = new ObjectId(cook_id);

    mongo.model.cook.find({
            '_id': obj_id
        },
        {
            title:1,
            complete_photo:1,
            reply:1,
            steps:1,
            stuffs:1,
            tags:1,
            w_cooker:1,
            yummy:1
        }).exec(function(err, docs){
            mongo.model.cooker.populate(docs, { path: 'w_cooker', select: 'nick_name state_comment cooker_photo'}, function (err, w_cooker_result) {
                if (err) {
                    throw err;
                } else {
                    mongo.model.yummy.populate(w_cooker_result, {path: 'yummy', select: 'cookers'}, function (err, yummy_result) {
                        if (err) {
                            throw err;
                        } else {
                            mongo.model.reply.populate(yummy_result, {path: 'reply', select: 'cookers'}, function (err, reply_result) {
                                if (err) {
                                    throw err;
                                } else {
                                    callback(reply_result);

                                }
                            })
                        }
                    })
                }
            });
        });
}

cooksFunc.checkmyyummyList = function(checkData, callback){
    console.log("------------------- checkYummy-------------------------");

    var obj_cooker_yummy_id = new ObjectId(checkData.cooker_yummy_id),
        obj_cook_id = new ObjectId(checkData.cook_id);

    console.log(checkData);

    mongo.model.yummy.find({
        '_id': obj_cooker_yummy_id,
        //'cooks._id' :  { "$in" : obj_cook_id}
        /*'cooks.0._id' : obj_cook_id*/
        'cooks._id': obj_cook_id
    }).exec(function(err, docs){

        /**
         * 결과 값이 없으면 undefined
         * 해당 cook에서 현재 이 cook이 없음 따라서 push
         */

        if(docs[0] == undefined){
            callback(false);
        } else {
            callback(true);
        }

    });
}

cooksFunc.calculateyummyRest= function(yummyData, front_callback){
    console.log("------------------- calculate Yummy -------------------------");

    /**
     * 1. cooker단일 객체에서 해당 cook_id가 있는지 판별
     * 2. 위의 콜백에서 판별된 결과로 pull / push
     */



    var obj_cook_yummy_id = new ObjectId(yummyData.cook_yummy_id),
        obj_cooker_yummy_id = new ObjectId(yummyData.cooker_yummy_id),
        obj_cook_id = new ObjectId(yummyData.cook_id),
        obj_cooker_id = new ObjectId(yummyData.cooker_id);

    var check = yummyData.check_yummy;

    if(!check){
        nimble.parallel([
            function(callback){
                /**
                 * cooker객체 기준 cook 배열
                 * 내 좋아요 목록 뒤지기
                 */
                mongo.model.yummy.update(
                    {'_id': obj_cooker_yummy_id},
                    { $push:
                    { cooks :
                    {
                        _id : obj_cook_id
                    }
                    }
                    },
                    {safe: true},
                    function (err, obj) {
                        if(err){
                            console.log(err + "in calculateyummyRest Func");
                        } else {
                            callback();
                        }
                    })
            },
            function(callback){
                /**
                 * cook객체 기준 cooker 배열
                 * 해당 쿡에서 사용자 뒤지기
                 */
                mongo.model.yummy.update(
                    {'_id': obj_cook_yummy_id},
                    { $push:
                    { cookers :
                    {
                        _id : obj_cooker_id
                    }
                    }
                    },
                    {safe: true},
                    function (err, obj) {
                        if(err){
                            console.log(err + "in calculateyummyRest Func");
                        } else {
                            callback();
                        }
                    })
            }
        ])
        front_callback();

    } else {
        nimble.parallel([
            function(callback){
                mongo.model.yummy.update(
                    {'_id': obj_cooker_yummy_id},
                    { $pull:
                    { cooks :
                    {
                        _id : obj_cook_id
                    }
                    }
                    },
                    {safe: true},
                    function (err, obj) {
                        if(err){
                            console.log(err + "in calculateyummyRest Func");
                        } else {
                            callback();
                        }
                    })
            },
            function(callback){
                mongo.model.yummy.update(
                    {'_id': obj_cook_yummy_id},
                    { $pull:
                    { cookers :
                    {
                        _id : obj_cooker_id
                    }
                    }
                    },
                    {safe: true},
                    function (err, obj) {
                        if(err){
                            console.log(err + "in calculateyummyRest Func");
                        } else {
                            callback();
                        }
                    })
            }
        ])
        front_callback();
    }
}

cooksFunc.deletereplyData = function(delete_obj, callback){
    var obj_reply_id = new ObjectId(delete_obj._id),
        obj_reply_cookers_id = new ObjectId(delete_obj.reply_cookers_id)

    mongo.model.reply.update(
        {'_id': obj_reply_id},
        { $pull:
        { cookers :
        {
            _id : obj_reply_cookers_id
        }
        }
        },
        {safe: true},
        function (err, obj) {
            if(err){
                console.log(err + "in calculateyummyRest Func");
            } else {
                callback();
            }
        })
}



cooksFunc.getcookeridbyNickname = function(nick_name, callback){
    mongo.model.cooker.find({
        'nick_name': nick_name
    },{
        '_id':1
    }).exec(function(err, docs){
            if(err){
                throw err;
            } else {
                callback(docs[0]);
            }
        });

}

cooksFunc.getinitialreplyData = function(requestData, callback){
    var obj_reply_id = new ObjectId(requestData.reply_id),
        obj_cook_id = new ObjectId(requestData.cook_id)

    mongo.model.reply.find({
        _id : obj_reply_id,
        cook : obj_cook_id
    }).exec(function(err, docs) {
        if(err){
            throw err;
        } else {
            mongo.model.cooker.populate(docs, { path: 'cookers.cooker_id', select: 'nick_name cooker_photo'}, function (err, cooker_result) {
                if (err) {
                    throw err;
                } else {
                    callback(cooker_result[0]);
                }
            })
        }
    });
}



cooksFunc.addreplyData= function(replyData, front_callback){

    var obj_reply_id = new ObjectId(replyData.reply_id),
        obj_cooker_id =  new ObjectId(replyData.cooker_id);

    nimble.series([
        function(callback) {

            var make_cookers = {};
            make_cookers._id = new ObjectId();
            make_cookers.cooker_id = obj_cooker_id;
            make_cookers.comment = replyData.comment;
            make_cookers.date = Date.now();

            /*
            {
                cooker_id : obj_cooker_id,
                    comment : replyData.comment,
                date : Date.now()
            }
            */

            mongo.model.reply.update(
                { _id:  obj_reply_id},
                { $push: {cookers : make_cookers} },
                {safe: true},
                function (err, obj) {
                    if(err){
                        console.log(err + "in calculateyummyRest Func");
                    } else {
                        callback();
                    }
                });

        },
        function(callback) {
            mongo.model.reply.find({_id :obj_reply_id},{
                cookers:1
            }, function(err, docs){
                mongo.model.cooker.populate(docs, { path: 'cookers.cooker_id', select: 'nick_name cooker_photo'}, function (err, cooker_info) {
                    if (err) {
                        throw err;
                    } else {
                        front_callback(cooker_info[0]);
                        callback();
                    }
                })
            })
        }
    ]);
}

cooksFunc.checkmyzimmyList = function(checkData, callback){
    console.log("------------------- checkZimmy-------------------------");

    var obj_cook_id = new ObjectId(checkData.cook_id),
        obj_cooker_id = new ObjectId(checkData.cooker_id);

    mongo.model.cooker.find({
        '_id': obj_cooker_id,
        //'cooks._id' :  { "$in" : obj_cook_id}
        'zimmys._id' : obj_cook_id
    }).exec(function(err, docs){

        /**
         * 결과 값이 없으면 undefined
         * 해당 cook에서 현재 이 cook이 없음 따라서 push
         */

        if(docs[0] == undefined){
            callback(false);
        } else {
            callback(true);
        }

    });
}

cooksFunc.manageZimmy= function(zimmyData, front_callback){
    console.log("------------------- manage zimmy -------------------------");

    var check;

    var obj_cook_id = new ObjectId(zimmyData.cook_id),
        obj_cooker_id = new ObjectId(zimmyData.cooker_id);


    nimble.series([
        function(callback) {
            mongo.model.cooker.find({
                '_id': obj_cooker_id,
                //'cooks._id' :  { "$in" : obj_cook_id}
                'zimmys.0._id' : obj_cook_id
            }).exec(function(err, docs){
                /**
                 * 결과 값이 없으면 undefined
                 * 해당 cook에서 현재 이 cook이 없음 따라서 push
                 */
                if(docs[0] == undefined){
                    check = false;
                } else {
                    check = true;
                }
                callback();
            });
        },
        function(callback) {
            if(!check){
                /**
                 * cooker객체 기준 cook 배열
                 * 내 좋아요 목록 뒤지기
                 */
                mongo.model.cooker.update(
                    {'_id': obj_cooker_id},
                    { $push:
                    { zimmys :
                    {
                        _id : obj_cook_id
                    }
                    }
                    },
                    {safe: true},
                    function (err, obj) {
                        if(err){
                            console.log(err + "in calculateyummyRest Func");
                        }
                    })
            } else {
                mongo.model.cooker.update(
                    {'_id': obj_cooker_id},
                    { $pull:
                    { zimmys :
                    {
                        _id : obj_cook_id
                    }
                    }
                    },
                    {safe: true},
                    function (err, obj) {
                        if(err){
                            console.log(err + "in calculateyummyRest Func");
                        }
                    })
            }
            callback();
        }
    ]);
}

cooksFunc.increasecookHit = function(cook_id, callback){
    var obj_cook_id = new ObjectId(cook_id);

    mongo.model.cook.findByIdAndUpdate
    (
        obj_cook_id,
        {
            $inc: {"hits" : 1}
        }, callback);
}



module.exports = cooksFunc;
