/**
 * Created by kimsungwoo on 2015. 10. 11..
 */

var express = require('express');
var router = express.Router();
var cooksBiz = require('../../mongoBiz/cooksMongoBiz/cooksBiz.js');

router.post('/', function(req, res, next) {
    console.log("~~~  cooks rest  ~~~~");

    cooksBiz.getcooksbymyFollowing(req.body, function(data){
        res.send(data);
    });
});

/**
 * zimmy part
 */

router.post('/cookSteps/checkmyZimmy', function(req, res, next) {
    console.log("~~~  yummy!! rest  ~~~~");

    cooksBiz.checkmyzimmyList(req.body, function(data){
        res.send(data);
    });
});

router.post('/cookSteps/zimmy', function(req, res, next) {
    console.log("~~~  zimmy rest  ~~~~");

    cooksBiz.manageZimmy(req.body, function(data){
        res.send(data);
    });
});

/**
 * yummy part
 */

router.post('/cookSteps/checkmyYummy', function(req, res, next) {
    console.log("~~~  yummy!! rest  ~~~~");

    cooksBiz.checkmyyummyList(req.body, function(data){
        /*var res_data = {};
         res_data.refreshedcooksStep = data;*/

        res.send(data);
    });
});

router.post('/cookSteps/yummy', function(req, res, next) {
    console.log("~~~  yummy!! rest  ~~~~");

    cooksBiz.calculateyummyRest(req.body, function(data){
        /*var res_data = {};
        res_data.refreshedcooksStep = data;*/

        res.send(data);
    });
});

/**
 * reply part
 */

router.post('/cookSteps/deletereply', function(req, res, next) {
    console.log("~~~  deletereply rest  ~~~~");

    cooksBiz.deletereplyData(req.body, function(data){
        res.send(data);
    });
});

router.post('/cookSteps/getcookerid/:nick_name', function(req, res, next) {
    console.log("~~~  getcookerid rest  ~~~~");

    cooksBiz.getcookeridbyNickname(req.params.nick_name, function(data){
        res.send(data);
    });
});

router.post('/cookSteps/initialreply', function(req, res, next) {
    console.log("~~~  initialreply rest  ~~~~");

    cooksBiz.getinitialreplyData(req.body, function(data){
        res.send(data);
    });
});

router.post('/cookSteps/addreply', function(req, res, next) {
    console.log("~~~  addreply rest  ~~~~");

    cooksBiz.addreplyData(req.body, function(data){
        res.send(data);
    });
});

/**
 * cookstep part
 */

router.post('/cookSteps/:cookID', function(req, res, next) {
    console.log("~~~  cookSteps rest  ~~~~");

    cooksBiz.getcookstepbyCookid(req.params.cookID, function(data){
        res.send(data);
    });
});



module.exports = router;
