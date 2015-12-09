/**
 * Created by airnold on 15. 12. 8..
 */


var apn = require('apn');

var options = {
    gateway : "gateway.sandbox.push.apple.com",
    cert: '',  /// PushExample2.pem
    key: '',   /// PushExampleKey2.pem
    passphrase : "" /// pem password
};

var apnConnection = new apn.Connection(options);

exports.sendingApnMessage = function(iphone_token, badge, alert_message, payload ){

    var token = iphone_token;
    var myDevice = new apn.Device(token);

    var note = new apn.Notification();
    note.badge = badge;

    note.alert = alert_message;
    note.sound = 'ping.aiff';

    note.payload = {'message': payload};

    apnConnection.pushNotification(note, myDevice);

};

