/**
 * Created by airnold on 15. 10. 16..
 */


var mongo = require('../../../model/mongoModel.js');
var ObjectId = require('mongoose').Types.ObjectId;
var nimble = require('nimble');


var cooker_mongo = {};

cooker_mongo.getCookerProfile = function (id, callback) {
    mongo.model.cooker.find({_id: ObjectId(id)}, function (err, docs) {
        if (err) {
            throw err;
        } else {
            callback(docs[0]);
        }
    })
};

cooker_mongo.getMycook = function (id, callback) {

    mongo.model.cook.find({
        'w_cooker': ObjectId(id)
    }, function (err, docs) {
        callback(docs);
    });
};

cooker_mongo.getZimmy = function (zimmy_list, callback) {

    mongo.model.cook.find(
        {'_id': {$in: zimmy_list}}
    ).exec(function (err, result) {
            if (err) {
                throw err;
            } else {
                mongo.model.cooker.populate(result, {
                    path: 'w_cooker',
                    select: 'nick_name'
                }, function (err, to_populate_result) {
                    if (err) {
                        throw err;
                    } else {
                        console.log(to_populate_result);
                        callback(to_populate_result);

                    }
                })
            }
        })
};

cooker_mongo.makefollow = function (follow, r_callback) {

    nimble.series([
        function (callback) {


            nimble.parallel([
                function (callback) {

                    var follow_data = {};
                    follow_data._id = ObjectId(follow.follow_id);
                    follow_data.nick_name = follow.follow_nickname;
                    follow_data.cooker_photo = follow.follow_photo;


                    mongo.model.cooker.findOneAndUpdate(
                        {
                            _id: ObjectId(follow.follower_id)
                        },
                        {
                            $push: {following: follow_data}
                        },
                        {
                            safe: true, upsert: true
                        },
                        function (err, model) {
                            if (err) {
                                throw err;
                                console.log(err);
                            } else {

                                callback();
                            }
                        }
                    );

                },
                function (callback) {

                    var follower_data = {};
                    follower_data._id = ObjectId(follow.follower_id);
                    follower_data.nick_name = follow.follower_nickname;
                    follower_data.cooker_photo = follow.follower_photo;

                    mongo.model.cooker.findOneAndUpdate(
                        {
                            _id: ObjectId(follow.follow_id)
                        },
                        {
                            $push: {followers: follower_data}
                        },
                        {
                            safe: true, upsert: true
                        },
                        function (err, model) {
                            if (err) {
                                throw err;
                                console.log(err);
                            } else {

                                callback();
                            }
                        }
                    );

                }
            ], callback)
        },
        function(callback){

            /**
             * 노티스 집어너기
             */

            var notice = new mongo.model.notice({

                kind_code: 'FM',
                from: follow.follower_id,
                to: follow.follow_id
            });
            notice.save(function(err){
                if(err){
                    throw err;
                }else{
                    callback();
                }
            })

        },
        function (callback) {
            r_callback(true);
            callback();
        }
    ]);
};

cooker_mongo.cancelfollow = function (follow, r_callback) {


    nimble.series([
        function (callback) {


            nimble.parallel([
                function (callback) {

                    var follow_data = {};
                    follow_data._id = ObjectId(follow.follow_id);

                    mongo.model.cooker.findOneAndUpdate(
                        {
                            _id: ObjectId(follow.follower_id)
                        },
                        {
                            $pull: {"following": {'_id': ObjectId(follow_data._id)}}
                        },
                        {
                            safe: true, upsert: true
                        },
                        function (err, model) {
                            if (err) {
                                throw err;
                                console.log(err);
                            } else {

                                callback();
                            }
                        }
                    );

                },
                function (callback) {
                    var follower_data = {};
                    follower_data._id = ObjectId(follow.follower_id);

                    mongo.model.cooker.findOneAndUpdate(
                        {
                            _id: ObjectId(follow.follow_id)
                        },
                        {
                            $pull: {"followers": {"_id": ObjectId(follower_data._id)}}
                        },
                        {
                            safe: true, upsert: true
                        },
                        function (err, model) {
                            if (err) {
                                throw err;
                                console.log(err);
                            } else {

                                callback();
                            }
                        }
                    );

                }
            ], callback)


        },
        function (callback) {
            r_callback(true);
            callback();
        }
    ]);


};

cooker_mongo.editProfile = function (edit_data, photo, callback) {

    if (edit_data.pw == '') {

        mongo.model.cooker.findOneAndUpdate(
            {
                _id: ObjectId(edit_data.cooker_id)
            },
            {
                $set: {
                    "name": edit_data.name,
                    "state_comment": edit_data.state_comment,
                    "cooker_photo": photo
                }
            },
            {
                safe: true
            },
            function (err, model) {
                if (err) {
                    throw err;
                    console.log(err);
                } else {
                    callback('not pw change and success');
                }
            }
        );


    } else {
        mongo.model.cooker.findOneAndUpdate(
            {
                _id: ObjectId(edit_data.cooker_id)
            },
            {
                $set: {
                    "name": edit_data.name,
                    "state_comment": edit_data.state_comment,
                    "cooker_photo": photo,
                    "pw": edit_data.pw
                }
            },
            {
                safe: true
            },
            function (err, model) {
                if (err) {
                    throw err;
                    console.log(err);
                } else {
                    callback('not pw change and success');
                }
            }
        );
    }
};

cooker_mongo.changePasswdCheck = function (id, pw, callback) {
    mongo.model.cooker.find({_id: ObjectId(id)}, function (err, docs) {
        var pw_check = pwCompare(pw, docs[0]);
        callback(pw_check);
    });
};


module.exports = cooker_mongo;


function pwCompare(pw, mongo_data) {
    if (pw == mongo_data.pw) {
        return true
    } else {
        return false;
    }
}
