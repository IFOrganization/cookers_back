/**
 * Created by kimsungwoo on 2015. 10. 11..
 */

var express = require('express');
var router = express.Router();
var searchBiz = require('../../mongoBiz/searchMongoBiz/searchBiz.js');

router.post('/', function(req, res, next) {
    console.log("~~~  search autocomplete rest  ~~~~");

    searchBiz.getautocompleteData(req.body, function(data){
        res.send(data);
    });
});

router.post('/tagsearch/:tag_param', function(req, res, next) {
    console.log("~~~  tag search rest  ~~~~");

    searchBiz.getcooklistbytagSearch(req.params.tag_param, function(data){
        res.send(data);
    });
});


module.exports = router;
