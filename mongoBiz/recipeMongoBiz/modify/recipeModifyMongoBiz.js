/**
 * Created by parkbeomsoo on 2015. 10. 12..
 */

var mongo = require('../../../model/mongoModel.js');
var config = require('../../../server_setting/server_config/dbConfig/mongoConfig.js');
var recipeModifyFunc = {};
var ObjectId = require('mongoose').Types.ObjectId;

recipeModifyFunc.modify = function(cook_id, query, call_back){
    mongo.model.cook.update(
        {_id : ObjectId(cook_id)},
        {
            $set : query
        },
        {   safe: true, upsert: true }
    ).exec(function(err, result){
        if(err)
            throw err;
        else
            call_back();

    });
};

recipeModifyFunc.findCook = function(cook_id, call_back){
    mongo.model.cook.find(
        { _id : ObjectId(cook_id) },
        { steps : 1 }
    ).exec(function(err, result){
        result = result[0];
        if(err)
            throw err;
        else{

            var url = config.mongodb.downloadUrl;
            for(var i in result.steps){
                result.steps[i].photo = url+ result.steps[i]._id+ ".png";
            }
            call_back(result.steps);
        }
    });
}

recipeModifyFunc.modifyStepId = function(cook_id, temp_steps, call_back){

    mongo.model.cook.update(
        { _id : ObjectId(cook_id)},
        {
            $set : {
                steps : temp_steps, complete_photo : temp_steps[temp_steps.length-1].photo
            }
        },
        {   safe: true, upsert: true }
    ).exec(function(err, result){
            if(err)
                throw err;
            else
                call_back(result);
    });
};

module.exports = recipeModifyFunc;

