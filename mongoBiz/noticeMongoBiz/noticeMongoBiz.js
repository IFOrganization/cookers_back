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


