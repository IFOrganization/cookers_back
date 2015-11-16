/**
 * Created by airnold on 15. 10. 9..
 */

var express = require('express');
var router = express.Router();
var sign_mongo = require('../../../mongoBiz/cookerMongoBiz/signMongoBiz/signmongoBiz.js');
var mailservice = require('../../../utility/mailService');
var nimble = require('nimble');
var johayoJwt = require('johayo-jwt');
var generatePassword = require('password-generator');


router.get('/idcheck', function (req, res, next) {

    /*console.log(mailservice.sendVerifyCode('airnold@naver.com'));*/

    /*mailservice.sendInstantPassword('airnold@naver.com', function(pw){
     console.log(pw);
     });*/


    sign_mongo.checksignEmail(req.query.email, function (data) {
        console.log(data);
        if (data === true) {
            /**
             * 존재하지않다면 가입이 가능하여 인증코드를보낸다.
             */
            if (req.query.what === 'up') {
                mailservice.sendVerifyCode(req.query.email, function (code) {
                    res.send(code);
                })
            }
            else {
                res.send(data);
            }

        } else {
            /**
             *  존재하면 false를 보내 다시 입력하도록
             */
            res.send(data);
        }
    });
});

router.post('/signup', function (req, res, next) {
    var sign_data = req.body.data;

    sign_mongo.signupUser(sign_data, function (signup_success_status) {

        res.send(signup_success_status);
    });
});


router.post('/signin', function (req, res, next) {

    /**
     * 받을 데이터 -> login에 필요한 id&password 그리고 자동로그인
     * 자동로그인에따라 jwt 생성 시간을 길고 짧게 만들어준다
     * 받은 후 database에서 검색을 한다음 없으면 throw error
     * id&password 확인 후 토큰 생성후 프론트로 전달
     *
     */

    var signin_data = req.body.data;

    var sign_success = undefined;
    var user_token = undefined;
    var sign_profile = undefined;

    nimble.series([
        function (callback) {
            /**
             * mongo에서 검색 & id passwd 확인
             */
            sign_mongo.checkSignin(signin_data, function (data) {
                sign_success = data.sign_success;
                sign_profile = data.profile;

                callback();
            });
        },
        function (callback) {

            if (sign_success == true) {
                /**
                 * 토큰 생성하는 부분
                 */
                var data = {
                    email: sign_profile.email,
                    name: sign_profile.nick_name
                };

                user_token = johayoJwt.encode(data, 9999999999999999999);

                callback();

            } else {
                callback();
            }
        },
        function (callback) {

            /**
             *  토큰 response
             */

            var sign_response_data = {};
            sign_response_data.sign_success = sign_success;
            sign_response_data.sign_token = user_token;
            sign_response_data.cooker_profile = sign_profile;


            res.send(sign_response_data);
            callback();

        }

    ]);

});


router.post('/findemail', function (req, res, next) {


    var find_data = req.body.data;

    sign_mongo.findEmail(find_data, function (found_data) {

        res.send(found_data);

    });

});

router.post('/findpw', function (req, res, next) {


    var find_data = req.body.data;

    var instant_password = generatePassword();

    /**
     * 몽고 db 에 update 하기
     */

    sign_mongo.setInstantPassword(find_data.email, instant_password);

    mailservice.sendInstantPassword(find_data.email,instant_password, function (result) {
        console.log(result);
        res.send(result);

    });

});

router.post('/checknickname', function (req, res, next) {


    var find_data = req.body.data;

    sign_mongo.checkNickname(find_data.nick_name, function (result) {

        res.send(result);

    });

});


module.exports = router;