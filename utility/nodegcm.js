/**
 * Created by airnold on 15. 12. 8..
 */

var gcm = require('node-gcm');

var server_access_key = '';   /// get sender id from front
var sender = new gcm.Sender(server_access_key);


exports.sendingGcmMessage = function(){

    var message = new gcm.Message({
        collapseKey: 'demo',
        delayWhileIdle: true,
        timeToLive: 3,
        data: {
            key1: 'pushpush',
            key2: 'android push server'
        }
    });

    var registrationIds = [];

    var registration_id = '';

    registrationIds.push(registration_id);

    sender.send(message, registrationIds, 4, function (err, result) {
        console.log(result);
    });

};