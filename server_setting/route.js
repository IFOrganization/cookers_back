/**
 * Created by airnold on 15. 7. 15..
 */
/**
 * 필요 라우터는 직접 넣어주길 ! ㅎㅎ
 * @param app
 */


var sign = require('../routes/cookerRoute/sign/sign.js');
var cooker = require('../routes/cookerRoute/cooker/cooker.js');
var recipeRegister = require('../routes/recipeRoute/register/recipeRegisterRoute');
var recipeModify = require('../routes/recipeRoute/modify/recipeModifyRoute');
var cooks = require('../routes/cooksRoute/cooks');
var search = require('../routes/searchRoute/search');
var notice = require('../routes/noticeRoute/noticeRoute');
var photo = require('../routes/photoRoute/photoRoute');


exports.routeSetting = function(app){

    app.use('/rest/sign/', sign);
    app.use('/rest/cooker/', cooker);
    app.use('/rest/recipe/register', recipeRegister);
    app.use('/rest/recipe/modify', recipeModify);
    app.use('/rest/cooks', cooks);
    app.use('/rest/search', search);
    app.use('/rest/notice', notice);
    app.use('/rest/photo', photo);

};

