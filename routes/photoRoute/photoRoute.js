
var express = require('express');
var router = express.Router();
var fs = require('fs');
var nimble = require('nimble');


router.post('/upload/:cook_id', function(req, res, next) {
    var steps = req.body;
    var condition = false;

    nimble.series([
        function(callback){
            for(var i = 0 ; i < steps.length ; i++) {
                console.log(steps[i].fileName);
                var base64Data = steps[i].photo.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "");
                fs.writeFile("upload/" + steps[i].fileName + ".png", base64Data, 'base64', function (err, result) {
                    if (err) {
                        condition = true;
                        console.log("err");
                    }
                });
            }
            callback();
        },
        function(callback){
            if(condition){
                res.send({
                    state : "500",
                    state_comment : "fail"
                });
            }else{
                res.send({
                    state : "200",
                    state_comment : "success"
                });
            }
            callback();
        }
    ]);

});

router.post('/upload/user/:user_id', function(req, res, next){
    console.log("upload/user/:user_id");
    var user_profile = req.body.data;

    var base64_data = user_profile.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpg;base64,/, "").replace(/^data:image\/jpeg;base64,/, "");
    fs.writeFile("upload/" + req.params.user_id+ ".png", base64_data, 'base64', function (err, result) {
        if (err) {
            throw err
        } else {
            res.send(true);
        }
    });
});

router.get('/download/:photo_path', function(req, res, next) {
    console.log("get photo Stream");
    console.log("/rest/photo/download/" + req.params.photo_path);
    /**
     * 1. find ':photo_path' file.
     * 2. response file using stream To User.
     */
    var stream = fs.createReadStream(__dirname + "/../../upload/"+req.params.photo_path);
    stream.pipe(res);

});

router.post('/upload/edit/:cook_id', function(req, res, next) {
    console.log("/rest/photo/upload/edit/" + req.params.cook_id);
    console.log(req.body.removes);
    console.log(req.body.steps.length);
    var remove_photos = req.body.removes;
    var create_photos = req.body.steps;

    nimble.series([
        function(callback){
            nimble.parallel([
                function(callback){
                    // remove file
                    if(remove_photos.length>0){
                        for(var i in remove_photos){
                            fs.unlink('upload/'+remove_photos[i], function(err){
                                if(err) throw err;
                                console.log("파일 삭제 완료");
                            });
                        }
                    }
                    callback();
                },
                function(callback){
                    // create file
                    if(create_photos.length>0){
                        for(var i = 0 ; i < create_photos.length ; i++) {
                            var base64Data = create_photos[i].photo.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "");
                            fs.writeFile("upload/" + create_photos[i].fileName + ".png", base64Data, 'base64', function (err, result) {
                                if (err) throw err;
                                console.log("파일 생성 완료");
                            });
                        }
                    }
                    callback();
                }
            ], callback);
        },
        function(callback){
            res.send({
                state:200,
                state_comment : "success"
            });
            callback();

        }
    ]);


    
});



module.exports = router;
