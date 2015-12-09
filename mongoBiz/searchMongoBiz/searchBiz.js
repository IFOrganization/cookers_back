/**
 * Created by kimsungwoo on 2015. 10. 27..
 */

var mongo = require('../../model/mongoModel.js');
var searchFunc = {};
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var nimble = require('nimble');


searchFunc.getautocompleteData = function(search_param, callback){
    if(search_param.type == "tag"){

        mongo.model.cook.aggregate(
        {
            $match : {
                "tags.tag_name": {
                    $regex: new RegExp(search_param.search_text, "i")
                }
            }
        },
        {
            $project : {
                tag_name : "$tags.tag_name",
                _id : "$_id"
            }
        },
        {
            $unwind: '$tag_name'
        },
        {
            $match : {
                "tag_name": {
                    $regex: new RegExp(search_param.search_text, "i")
                }
            }
        },
        {
            $group : {
                _id : "$tag_name",
                count : { $sum : 1 }
                //cooks : {
                //    $addToSet: "$_id"
                //}
            }
        },
        {
            $project : {
                _id : 0,
                tag_name : "$_id",
                count :1
            }
        },
        function(err, result){
            if(err){
                throw err;
            } else{
                callback(result);
            }
        });
    } else if(search_param.type == "cook") {
        mongo.model.cook.find({
            title: new RegExp(search_param.search_text, "i")
        }, function(err, doc) {
            //Do your action here..
            if(err){
                throw err;
            } else {
                mongo.model.cooker.populate(doc, { path: 'w_cooker', select: 'nick_name state_comment cooker_photo'}, function (err, w_cooker_result) {
                    if (err) {
                        throw err;
                    } else {
                        callback(w_cooker_result);
                    }
                });
            }
        });
    } else {
        mongo.model.cooker.find({
            nick_name: new RegExp(search_param.search_text, "i")
        }, function(err, doc) {
            //Do your action here..
            if(err){
                throw err;
            } else {
                callback(doc);
            }
        });
    }
}

searchFunc.getcooklistbytagSearch = function(tag_param, callback){
    mongo.model.cook.find({
        /**
         * '성우' 검색시
         *
         * 'tags.tag_name' : new RegExp(tag_param, "i")는
         * 3개의 리스트를 가져옴.
         *
         * 'tags.tag_name' : { "$in" : [tag_param] }는
         * 하나의 cook에 2개의 '성우'tag가 있어도
         * 총 2개의 리스트를 가져옴.
         */
        'tags.tag_name' : { "$in" : [tag_param] }
    }).exec(function(err, docs) {
        if(err){
            throw err;
        } else {
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
        }
    });
}

module.exports = searchFunc;
