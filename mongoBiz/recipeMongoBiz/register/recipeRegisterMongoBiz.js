/**
 * Created by parkbeomsoo on 2015. 10. 12..
 */

var mongo = require('../../../model/mongoModel.js');

var recipeRegisterFunc = {};
var ObjectId = require('mongoose').Types.ObjectId;


recipeRegisterFunc.register = function(cook, callback){

    var new_cook = new mongo.model.cook({
        w_cooker : ObjectId(cook.w_cooker),
        title : cook.title,
        desc : cook.desc,
        stuffs: cook.stuffs,
        stuff_quantity : cook.stuffs.length,
        steps : cook.steps,
        tags : cook.tags,
        yummy : ObjectId(cook.yummy),
        hits : 0,
        reply : ObjectId(cook.reply)
    });

    console.log(cook);

    new_cook.save(function(err, cook){
        if( err ){
            throw err;
        } else{
            callback(cook);
        }
    });

}

recipeRegisterFunc.updateCookStepPhoto = function(cook_id, cook_steps, comple_photo, callback){
    mongo.model.cook.update(
        {
            _id: ObjectId(cook_id)
        },
        {
            $set :{ steps : cook_steps, complete_photo : comple_photo }
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

recipeRegisterFunc.insertYummy = function(callback){
    var new_yummy = new mongo.model.yummy({
        state_code : 1,
        cookers : []
    });

    new_yummy.save(function(err, yummy){
        if(err){
            throw err
        }else{
            callback(yummy._id);
        }
    });
};

recipeRegisterFunc.insertReply = function(callback){
    var new_reply = new mongo.model.reply({
        cookers:[]
    });

    new_reply.save(function(err, reply){
        if(err){
            throw err
        }else{
            callback(reply._id);
        }
    });
}

recipeRegisterFunc.updateCookInYummy = function(yummy_id, cook_id, callback){
    mongo.model.yummy.update(
        {
            _id: ObjectId(yummy_id)
        },
        {
            $set :{ cook : ObjectId(cook_id)}
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

recipeRegisterFunc.updateCookInReply = function(reply_id, cook_id, callback){
    mongo.model.reply.update(
        {
            _id: ObjectId(reply_id)
        },
        {
            $set :{ cook : ObjectId(cook_id)}
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

recipeRegisterFunc.updateMyCookInCooker = function(cooker_id, cook_id, callback){

    mongo.model.cooker.update(
        { _id : ObjectId(cooker_id)},
        {
            $push : { my_cook : {_id : ObjectId(cook_id)} }
        }
    ).exec(function(err, result){
        if(err){
            throw err;
        }else{
            callback(result);
        }
    })

}

recipeRegisterFunc.deleteCook = function(cook_id, callback){

}

recipeRegisterFunc.deleteYummy = function(yummy_id, callback){

}

recipeRegisterFunc.deleteReply= function(reply_id, callback){

}

module.exports = recipeRegisterFunc;