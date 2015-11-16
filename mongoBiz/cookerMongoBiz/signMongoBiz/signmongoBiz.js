/**
 * Created by airnold on 15. 10. 9..
 */

var mongo = require('../../../model/mongoModel.js');
var ObjectId = require('mongoose').Types.ObjectId;

var sign_mongo = {};

sign_mongo.checksignEmail = function (email, callback) {

    mongo.model.cooker.find({email: email}, function (err, docs) {


        if (docs.length == 0) {
            /**
             * 아무것도 없다true를 보내면됨
             */

            callback(true);
        } else {
            /**
             * 존재함 false를 보내면됨
             */

            callback(false)
        }
    });
};

sign_mongo.signupUser = function (signup_info, callback) {
    var user_sign = new mongo.model.cooker();

    user_sign.email = signup_info.email;
    user_sign.pw = signup_info.pw;
    user_sign.nick_name = signup_info.nickname.replace(/\s/gi, '');
    user_sign.name = signup_info.name;
    user_sign.subemail = signup_info.subemail;
    user_sign.cooker_photo = '';
    user_sign.state_comment = '';
    user_sign.phone = '';

    user_sign.save(function (err, userinfo) {
        if (err) {
            throw err;
        } else {
            var yummyscooker = new mongo.model.yummy();
            yummyscooker.cooker = ObjectId(userinfo.id);
            yummyscooker.save(function(err, yummyinfo){
                if(err){
                    throw err;
                }else{
                    mongo.model.cooker.update(
                        {'_id' : ObjectId(userinfo.id)},
                        {'yummy': ObjectId(yummyinfo.id)},
                        {safe: true},
                        function (err) {
                            if(err){
                                throw err;
                            } else {
                                callback(true);
                            }
                        });
                }
            });
        }
    });
};


sign_mongo.checkSignin = function (signin_data, callback) {
    mongo.model.cooker.find({email: signin_data.email}, function (err, docs) {

        var user_data = {};
        user_data.sign_success = signinCompare(signin_data, docs[0]);
        user_data.profile = docs[0];

        callback(user_data);

    });
};

sign_mongo.findEmail = function (find_data, callback) {

    mongo.model.cooker.find({$and:[{subemail : find_data.subemail}, {name : find_data.name}]}, {email : 1}, function (err, docs) {

        var found_data = {};

        found_data = docs;

        callback(found_data);

    });
};

sign_mongo.setInstantPassword = function(email, pw){
    mongo.model.cooker.update({"email" : email}, {$set : {"pw" : pw}}, function(err, status){
        if(err){
            throw err;
        }else{
            console.log('pw change success');
        }
    })
};

sign_mongo.checkNickname = function(nick_name, callback){
    mongo.model.cooker.find({nick_name: nick_name.replace(/\s/gi, '')}, function (err, docs) {

        if (docs.length == 0) {
            /**
             * 아무것도 없다true를 보내면됨
             */

            callback(true);
        } else {
            /**
             * 존재함 false를 보내면됨
             */

            callback(false)
        }

    });
};


module.exports = sign_mongo;

function signinCompare(signin_data, mongo_data) {
    if (signin_data.email == mongo_data.email) {

        if (signin_data.pw == mongo_data.pw) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
