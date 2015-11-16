/**
 * Created by airnold on 15. 7. 15..
 */


exports.errorSetting = function(app){

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers
    app.use(function errorHandler(err, req, res, next) {

        console.log('-------------------------------------------------------\n');
        console.log(err);
        console.log('-------------------------------------------------------\n');
        console.log('error on request %s | %s | %d', req.method, req.url, err.status);
        console.log('\n' + err.stack);


        err.message = err.status == 500 ? 'Something bad happened. :(' : err.message;


        res.send(err.message);
    });

};