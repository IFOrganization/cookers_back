/**
 * Created by airnold on 15. 7. 15..
 */

exports.middlewareSetting = function(app, serverModule){
    // view engine setup
    app.set('port', process.env.PORT || 3100);
    app.set('views', serverModule.path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');

    // uncomment after placing your favicon in /public
    /*app.use(serverModule.favicon(__dirname + '/public/favicon.ico'));*/
    app.use(serverModule.cors());
    app.use(serverModule.domain);
    app.use(serverModule.logger('dev'));

    app.use(serverModule.bodyParser.json({limit: '50mb'}));
    app.use(serverModule.bodyParser.urlencoded({limit: '50mb', extended: true}));

    app.use(serverModule.cookieParser());
    app.use(serverModule.johayojwt({
        /* jwt 토큰의 데이터부분을 한번더 암호화 할때 쓰는 암호화키 */
        tokenSecret: "makeyouriftoken",
        /* jwt 자체 암호화 키 */
        jwtSecret: "makeyourifjwt",
        /* jwt 암호화 알고리즘(디폴트: HS256)  */
        algorithm: "HS256",
        /* 만료시간 초단위 (디폴트: 3600 - 1시간) */
        /*expireTime: 3600,*/
        /* 복호화 한후 정보 저장위치(디폴트: req.user) */
        userProperty: "user"
    }));
    app.use(serverModule.express.static(serverModule.path.join(__dirname, '../public')));
};
