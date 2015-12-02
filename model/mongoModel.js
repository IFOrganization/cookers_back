var config = require('../server_setting/server_config/dbConfig/mongoConfig.js');
var mongo = {};
mongo.mongoose = require('mongoose');

var db = mongo.mongoose.connect(config.mongodb.connectUrl).connection;
db.on('error', console.error.bind(console, 'connection error -0-:'));
db.once('open', function (callback) {
    console.log("db open callback : "+callback);
});

/* 스키마 */
mongo.schema = {};

var Schema = mongo.mongoose.Schema;

mongo.schema.cooker = new Schema({

    _Id : Schema.Types.ObjectId,
    email : { type : String, unique : true},
    nick_name : { type : String, unique : true},
    pw : String,
    phone : String,
    name : String,
    subemail : String,
    zimmys : [{ _id : { type :Schema.Types.ObjectId, ref : "cook" }}],
    my_cook : [{ _id : { type :Schema.Types.ObjectId, ref : "cook"}}],
    yummy : { type :Schema.Types.ObjectId, ref : "yummy" },
    state_comment : String,
    followers : [{
        _id : Schema.Types.ObjectId,
        nick_name : String,
        cooker_photo : String
    }],
    following : [{
        _id : Schema.Types.ObjectId,
        nick_name : String,
        cooker_photo : String
    }],
    cooker_photo : String,
    date : { type : Date , default : Date.now }
});

//  follower & flowing 도 따로 빠지는 게 좋은 건가 ??

mongo.schema.cook = new Schema({
    _Id : Schema.Types.ObjectId,
    w_cooker : {type : Schema.Types.ObjectId, ref : 'cooker'},
    title : String,
    desc : String,
    stuffs:[{ stuff_name : String }],
    stuff_quantity : Number,
    complete_photo : String,
    steps : [{
        step : Number,
        content : String,
        photo : String
    }],
    tags : [{ tag_name : String }],
    yummy : { type : Schema.Types.ObjectId, ref : "cook"},
    hits : Number,
    reply : {type : Schema.Types.ObjectId, ref : 'reply'},
    date : { type : Date, default : Date.now }
});

mongo.schema.reply = new Schema({
    _Id : Schema.Types.ObjectId,
    cook : {type : Schema.Types.ObjectId, ref : 'cook'},
    cookers :[{
        _id : Schema.Types.ObjectId,
        cooker_id : { type : Schema.Types.ObjectId, ref :'cooker'},
        comment : String,
        date : { type : Date, default : Date.now }
    }],

});

mongo.schema.notice = new Schema({

    _Id : Schema.Types.ObjectId,
    kind_code : String,
    from : {type: Schema.Types.ObjectId, ref : 'cooker'},
    to : {type: Schema.Types.ObjectId, ref : 'cooker'},
    cook : {type: Schema.Types.ObjectId, ref : 'cook'},
    state_code : { type :Boolean, default : false },
    date : { type : Date, default : Date.now }
});

mongo.schema.report = new Schema({

    _Id :  Schema.Types.ObjectId,
    cook :  {type : Schema.Types.ObjectId, ref : 'cook'},
    reporter : {type : Schema.Types.ObjectId, ref : 'cooker'},
    content : String,
    date : { type : Date, default : Date.now }

});


mongo.schema.yummy = new Schema({

    _Id :  Schema.Types.ObjectId,
    state_code : { type : Number, default : 0},
    cook :  {type : Schema.Types.ObjectId, ref : 'cook'},
    cooker : {type : Schema.Types.ObjectId, ref : 'cooker'},

    cooks : [{ _id : { type : Schema.Types.ObjectId, ref : "cook"} }],
    cookers : [{ _id : { type : Schema.Types.ObjectId, ref : "cooker"} }]

    /**
     * state_code
     *  0 : cooker 단일 객체 cooks Array (내가 누른 좋아요 게시물들)
     *  1 : cook 단일 객체 cookers Array (이 게시물의 좋아요를 누른 유저들)
     */

});


mongo.model = {};
mongo.model.cooker = mongo.mongoose.model('cooker', mongo.schema.cooker);
mongo.model.cook = mongo.mongoose.model('cook', mongo.schema.cook);
mongo.model.notice = mongo.mongoose.model('notice', mongo.schema.notice);
mongo.model.report = mongo.mongoose.model('report', mongo.schema.report);
mongo.model.yummy = mongo.mongoose.model('yummy',mongo.schema.yummy);
mongo.model.reply = mongo.mongoose.model('reply', mongo.schema.reply);
module.exports = mongo;