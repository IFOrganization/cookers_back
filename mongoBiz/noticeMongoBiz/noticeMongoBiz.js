/**
 * Created by parkbeomsoo on 2015. 10. 12..
 */

var mongo = require('../../model/mongoModel.js');
var noticeFunc = {};
var ObjectId = require('mongoose').Types.ObjectId;


noticeFunc.findNotices = function(to, callback){
    mongo.model.notice.find(
        {to : ObjectId(to), state_code : false}
    ).sort({date: -1})
    .exec(function(err, result){
        if( err ){
            throw err;
        } else{
            mongo.model.cooker.populate(result, {path :'to', select : 'nick_name cooker_photo'}, function(err, to_populate_result){
                if( err ){
                    throw err;
                } else {
                    mongo.model.cooker.populate(to_populate_result, {path :'from', select : 'nick_name cooker_photo'}, function(err, from_populate_result){
                        if( err ){
                            throw err;
                        } else {
                            mongo.model.cook.populate(from_populate_result, {path :'cook', select : 'title comple_photo'}, function(err, cook_populate_result){
                                if( err ){
                                    throw err;
                                } else {
                                    callback(result);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

noticeFunc.updateNoticeState = function(notice_id, callback){
    //mongo.model.notice.findOneAndUpdate(
    mongo.model.notice.update(
        {
            _id: ObjectId(notice_id)
        },
        {
            $set :{ state_code : true }
        },
        {
            safe: true, upsert: true
        }
    ).exec(function(err, result){
        if(err){
            throw err;
        }else{
            callback(result);
        }

    });

}
//noticeFunc.getNoticeGroupByKindCode = function(to, callback){
//    console.log("Notice Mongo Biz to_id : " + to);
//
//    /**
//     *  using group function
//     */
//    mongo.model.notice.aggregate(
//        {
//            $group : {
//                _id : { kind_code : "$kind_code", "cook_id" : "$cook_id"},
//                count : { $sum : 1 },
//                from_list : {
//                    $push : "$from.cooker_id"
//                },
//                notice_id_list : {
//                    $addToSet : "$_id"
//                },
//                to_cooker : {
//                    $first:"$to.cooker_id"
//                },
//                represent : {
//                    $first : "$from.cooker_id"
//                }
//            }
//        },
//        {
//            $project : {
//                _id : 0,
//                kind_code : "$_id.kind_code",
//                cook : "$_id.cook_id",
//                count : 1,
//                from_list :1,
//                notice_id_list: 1,
//                to_cooker : 1,
//                represent : 1
//            }
//        },
//        function(err, result){
//            mongo.model.cook.populate(result, {path:'cook', select :'title desc comple_photo'}, function(err, cook_populate_result){
//                mongo.model.cooker.populate(cook_populate_result, {path : 'to_cooker', select : 'nick_name cooker_photo'}, function (err, to_cooker_populate_result) {
//                    mongo.model.cooker.populate(to_cooker_populate_result, {path : 'represent',select : 'cooker_photo _id'}, function (err, represent_result) {
//                        mongo.model.cooker.populate(represent_result, {path :'from_list', select : 'nick_name'}, function(err, from_list_populate_result){
//                            callback(from_list_populate_result);
//                        });
//                    });
//                });
//            });
//        }
//    );
//};


noticeFunc.notice_insert = function(notice_object, callback){
    var new_notice = new mongo.model.notice({
        kind_code : notice_object.kind_code,
        from : ObjectId(notice_object.from),
        to : ObjectId(notice_object.to),
        cook : ObjectId(notice_object.cook),
        date : Date.now()
    });

    new_notice.save(function(err, result){
        if( err ){
            throw err;
        } else{
            callback(result);
        }
    });

}

module.exports = noticeFunc;


