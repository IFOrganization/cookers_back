/**
 * Created by parkbeomsoo on 2015. 10. 12..
 */

var express = require('express');
var router = express.Router();
var recipeModifyFunc = require('../../../mongoBiz/recipeMongoBiz/modify/recipeModifyMongoBiz.js');
var nimble = require('nimble');


router.post('/:cook_id', function(req, res, next) {
    console.log("modify---------: " + req.params.cook_id);
    var cook_id = req.params.cook_id;
    var origin_step_ids = req.body.origin_step_ids;
    var query = { };
    var temp_steps=[];
    var cur_steps_id_array = [];
    var res_condition = false;
    var removes =[];
    var skips = [];

    var settingQuery_Array = function(key, array_object, property){
        if(array_object != undefined){
            query[key] = [];
            for(var i in array_object){
                var value={};
                value[property] = array_object[i][property];
                query[key].push(value);
            }
        }
    }
    var settingQeury_property = function(key, value){
        if(value != undefined) query[key] = value;
    }

    settingQeury_property("title", req.body.title);
    settingQeury_property("desc", req.body.desc);
    settingQuery_Array("stuffs", req.body.stuffs, "stuff_name");
    settingQeury_property("stuff_quantity", req.body.stuff_quantity);
    settingQuery_Array("tags", req.body.tags, "tag_name");
    settingQeury_property("steps", req.body.steps);
    //settingQeury_property("pre_photo", req.body.pre_photo);



    nimble.series([
        function(callbcak){
           recipeModifyFunc.modify(cook_id, query, function(){
               callbcak();
           });
        },
        function(callback){
            recipeModifyFunc.findCook(cook_id, function(result){
                temp_steps = result;
                callback();
            });
        },
        function(callback){
           recipeModifyFunc.modifyStepId(cook_id, temp_steps, function(result){
               if(result.nModified ==1){
                   res_condition = true;

                   for(var i = 0 ; i < temp_steps.length  ; i++){
                        cur_steps_id_array.push(temp_steps[i]._id);
                   }


                   for(var i in origin_step_ids){
                       var condition = true;
                       for(var j in cur_steps_id_array){
                           if(origin_step_ids[i] == cur_steps_id_array[j]){
                               skips.push(j)
                               condition = false;
                               break;
                           }
                       }

                       if(condition){
                           removes.push(origin_step_ids[i] +".png");
                       }
                   }
               }
               callback();
           })
        },
        function(callback){

            if(res_condition){
                res.send({
                    state : 200,
                    state_comment : "success",
                    _id : cook_id,
                    skips : skips,
                    removes : removes,
                    current_steps_id : cur_steps_id_array
                });
            } else{
                res.send({
                    state : 500,
                    state_comment : "fail",
                    _id : undefined,
                    skips : undefined,
                    remove : undefined
                });
            }
            callback();
        }
    ]);
});

router.get('/', function(req, res, next) {
    console.log("modify---------");
});




module.exports = router;