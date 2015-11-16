/**
 * Created by airnold on 15. 10. 8..
 */

/*var config = require('../server_setting/server_config/dbConfig/mongoConfig.js');
var mongo = {};
mongo.mongoose = require('mongoose');

var db = mongo.mongoose.connect(config.mongodb.connectUrl).connection;
db.on('error', console.error.bind(console, 'connection error -0-:'));
db.once('open', function (callback) {
    console.log("db open callback : "+callback);
});

var Schema = mongo.mongoose.Schema;
/!* 스키마 *!/
mongo.schema = {};*/


/**
 * cooker : {
      _id : < MongoDB_ObjectID >,
      email : <이메일>,
      nick_name : <닉네임>,
      pw : <비밀번호>,
      name : <쿠커_이름>,
      phone : <휴대폰_번호>,
      zimmys : [{        <찜한_글_목록>
          z_cook_id : < Mongo_CookId >
      }],
      my_cook : [{    <내가_쓴_글_목록>
          m_cook_id : < Mongo_CookId >
      }],
      yummys : [{        <좋아하는_글_목록>
          y_cook)id : < Mongo_CookId >
      }],
      state_comment : <상태글>,
      followers : [{ <팔로워_리스트> - < follow me >
          fm_cooker_id : < cooker_id >,
          fm_cooker_nick_name : <cooker_nick_name>
      }],
      following : [{ <팔로잉_리스트> - < follow you >
          fy_cooker_id : < cooker_id >,
          fy_cooker_nick_name : <cooker_nick_name>
      }],
      cooker_photo : {    <쿠커_사진>
          path : <경로>,
          base64_data : <base64 데이터>
      }
   }
 */


/*
mongo.schema.cooker = new Schema({

    _Id : Schema.Types.ObjectId,
    email : String,
    nick_name : String,
    pw : String,
    phone : String,
    name : String,
    subemail : String,
    zimmys : [
        {
            z_cook_id : Schema.Types.ObjectId
        }
    ],
    my_cook : [
        {
            m_cook_id : Schema.Types.ObjectId
        }
    ],
    yummys : [
        {
            y_cook_id : Schema.Types.ObjectId
        }
    ],
    state_comment : String,
    followers : [
        {
            fm_cooker_id : Schema.Types.ObjectId,
            fm_cooker_nick_name : String
        }
    ],
    following : [
        {
            fy_cooker_id : Schema.Types.ObjectId,
            fy_cooker_nick_name : String
        }
    ],
    cooker_photo : {
        path : String,
        base64_data : String
    }

});
*/


/**
 * cook : {
   _id : < MongoDB_ObjectID >,
      title : <제목>,
      desc : <간단설명>,
      stuffs : [{            <재료리스트>
          stuff_name : <재료_명>
      }],
      stuff_quantity : <재료 수>,
      comple_photo : {    <완성_사진>
          path : <경로>,
          base64_data : <base64_데아터>
      },
      steps : [{             <요리_단계>
          step : <index>,
          content : <내용>,
          photo : {
              path : <경로>,
              base64_data : <base64_데아터>
          }
      }],
      tags : [{            <태그_배열>
          tag_name : <태그_명>
      }],
      yummy_cookers : [{    <좋아요_한_쿠커목록>
          y_cooker_id : < MongoDB_ObjectID >,
          y_cooker_nick_name : <쿠커닉네임>,
          y_cooker_photo : {
              path : <경로>,
              base64_data : <base64_데아터>
          }
      }],
      yummy : <좋아요>,
      hits : <조회수>,
      reply : [{            <댓글>
          r_comment : <댓글_내용>
          r_cooker_id : < MongoDB_ObjectID >,
          r_cooker_nick_name : <닉네임>,
          r_cooker_photo : {
              path : <경로>,
              base64_data : <base64_데이터>
          },
          r_date : <날짜>
      }],
      register_date : <날짜>,
      w_cooker_info : {
          cooker_id : < MongoDB_ObjectID >,
          cooker_nick_name : <쿠커닉네임>,
          cooker_photo : {
              path : <경로>,
              base64_data : <base64_데이터>
          }
      }
 * }
 *
 */

/*mongo.schema.cook = new Schema({

    _Id : Schema.Types.ObjectId,
    title : String,
    desc : String,
    stuffs:[
        {
            stuff_name : String
        }
    ],
    stuff_quantity : Number,
    comple_photo : {
        path : String,
        base64_data : String
    },
    steps : [
        {
            step : Number,
            content : String,
            photo : {
                path : String,
                base64_data : String
            }
        }
    ],
    tags : [
        {
            tag_name : String
        }
    ],
    yummy_cookers : [
        {
            y_cooker_id : Schema.Types.ObjectId,
            y_cooker_nick_name : String,
            y_cooker_photo : {
                path : String,
                base64_data : String
            }
        }
    ],
    yummy : Number,
    hits : Number,
    reply : [
        {
            r_comment : String,
            r_cooker_id : Schema.Types.ObjectId,
            r_cooker_nick_name : String,
            r_cooker_photo : {
                path : String,
                base64_data : String
            },
            r_date : {
                type : Date,
                default : Date.now
            }
        }
    ],
    register_date : {
        type : Date,
        default : Date.now
    },
    w_cooker_info : {
        cooker_id : Schema.Types.ObjectId,
        cooker_nick_name : String,
        cooker_photo : {
            path : String,
            base64_data : String
        }
    }
});*/


/**
 * notice : {
   _id : < MongoDB_ObjectID >,
      kind_code : <알림_종류>,
      from : {        <보내는_이>
          cooker_id : < MongoDB_ObjectId >,
          cooker_nick_name : <닉네임>,
      },
      to : {            <받는_이>
          cooker_id : < MongoDB_ObjectId >,
          cooker_nick_name : <닉네임>
      },
      cook_id : <ObjectId>
      state_code : <알림_확인_Flag>,
      date : <날짜>
 * }
 *
 *
 *  FM : 나를 팔로우
    FC : 팔로잉 한 사람 게시글
    R : 내 글에 댓글
    L : 좋아요
    T : 나를 태그
 */
/*mongo.schema.notice = new Schema({

    _Id : Schema.Types.ObjectId,
    kind_code : String,
    from : {type: Schema.Types.ObjectId, ref : 'cooker'},
    to : {type: Schema.Types.ObjectId, ref : 'cooker'},
    cook : {type: Schema.Types.ObjectId, ref : 'cook'},
    state_code : {
        type :Boolean,
        default : false
    },
    date : {
        type : Date,
        default : Date.now
    }
});*/


/**
 *
 * report : {
     _id : < MongoDB_ObjectID >,
      cook_id : <요리_아이디>,
      reporter : { <신고자>
          cooker_id : < MongoDB_ObjectID >,
          cooker_nick_name : <닉네임>
      },
      content : <신고_내용>,
      date : <날짜>
 * }
 */

/*mongo.schema.report = new Schema({

    _Id :  Schema.Types.ObjectId,
    cook_id : String,
    reporter : {
        cooker_id : Schema.Types.ObjectId,
        cooker_nick_name : String
    },
    content : String,
    date : {
        type : Date,
        default : Date.now
    }
});


/!* 관리자 sub 메뉴 *!/
mongo.schema.adminSubMenu = new Schema({
    name: String,
    nickName: String,
    url: String,
    api : String,
    rank: Number,
    userId : String,
    regDt: Date
});

/!* 관리자 메뉴 *!/
mongo.schema.adminMenu = new Schema({
    name: String,
    nickName: String,
    url: String,
    api : String,
    rank: Number,
    subMenuList: [mongo.schema.adminSubMenu],
    userId : String,
    regDt: {type: Date, default: Date.now}
});*/

/*


mongo.model = {};
mongo.model.cooker = mongo.mongoose.model('cooker', mongo.schema.cooker);
mongo.model.cook = mongo.mongoose.model('cook', mongo.schema.cook);
mongo.model.notice = mongo.mongoose.model('notice', mongo.schema.notice);
mongo.model.report = mongo.mongoose.model('report', mongo.schema.report);

mongo.model.adminMenu = mongo.mongoose.model('adminMenu',mongo.schema.adminMenu);
mongo.model.adminSubMenu = mongo.mongoose.model('adminSubMenu',mongo.schema.adminSubMenu);


module.exports = mongo;
*/
