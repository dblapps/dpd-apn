var Resource = require('deployd/lib/resource');
var util     = require('util');
var apn      = require('apn');

function dpdapn(instanceName){
    Resource.apply(this, arguments);

    var options = {
        "cert":       this.config.cert,
        "key":        this.config.key,
        "passphrase": this.config.passphrase,
        "production": !this.config.sandbox,
        "contentAvailable": this.config.contentAvailable
    }

    var needNewConnection = false;
    if (dpdapn.connectionOptions[instanceName]) {
        if (JSON.stringify(options) !== JSON.stringify(dpdapn.connectionOptions[instanceName])) {
            needNewConnection = true;
        }
    } else {
        needNewConnection = true;
    }

    if (needNewConnection) {
        dpdapn.connections[instanceName] = new apn.Connection(options);
        dpdapn.connectionOptions = options;
    }

/*
    if (!dpdapn.feedback[instanceName] && this.config.cert && this.config.key) {
        dpdapn.feedback[instanceName] = new apn.Feedback(
            {
                cert: this.config.cert,
                key:  this.config.key,
                batchFeedback: true,
                interval: 10,
                address: this.config.sandbox ? "feedback.sandbox.push.apple.com" : "feedback.push.apple.com"
            }
        );
        dpdapn.feedback[instanceName].on("feedback", function(devices) {
*/
//console.log(devices);
//dpd.devices.get(function(result,error) {
//  console.log(result);
//});
        });
    }
}

util.inherits(dpdapn, Resource);

dpdapn.connections = {};
dpdapn.feedback = {};
dpdapn.connectionOptions = {};

dpdapn.label = "APN";
dpdapn.events = ["post"];

dpdapn.prototype.clientGeneration = true;

dpdapn.basicDashboard = {
    settings: [
        {
            name        : 'cert',
            type        : 'string',
            description : 'Certificate file location (/home/..)'
        },
        {
            name        : 'key',
            type        : 'string',
            description : 'Key file location (/home/..)'
        },
        {
            name        : 'passphrase',
            type        : 'string',
            description : 'Apple Passphrase'
        },
        {
            name        : 'defaultMsg',
            type        : 'string',
            description : 'Default message'
        },
        {
            name        : 'badge',
            type        : 'string',
            description : 'Badge Count. Defaults to 1'
        },
        {
            name        : 'sound',
            type        : 'string',
            description : 'Sound file. Defaults to "ping.aiff"'
        },
        {
            name        : 'sandbox',
            type        : 'checkbox',
            description : 'Use production or sandbox APN service. Defaults to production.'
        },
        {
            name        : 'contentAvailable',
            type        : 'checkbox',
            description : 'Should push notifications use content-available. Defaults to false.'
        }
    ]
}

dpdapn.prototype.handle = function ( ctx, next ) {
//dpd.devices.get(function(result,error) {
//  console.log(result);
//});
    var instanceName = ctx.req.url.replace(/\//, "");
    var apnconn = dpdapn.connections[instanceName];
    var devices = [];
    var message = "";

    if(ctx.body && ctx.body.devices){
        devices = ctx.body.devices;
    }
devices.push("ab06e720b95a03e459f72ee5c830801e3ef19f4ed07732bb85b2cadcf1feea48");

    if(ctx.body && ctx.body.message){
        message = ctx.body.message;
    }else{
        message = this.config.defaultMsg ? this.config.defaultMsg : "";
    }

    var note = new apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 360000;
    if (this.config.badge) note.badge = parseInt(this.config.badge);
    if (this.config.sound) note.sound = this.config.sound;
    if (message != "") note.alert = message;
    if (ctx.body.payload) note.payload = ctx.body.payload;
    if (this.config.contentAvailable) note.setContentAvailable(true);

    try {
      apnconn.pushNotification(note, devices);
      ctx.done(null, {dispatched: true});
    } catch (err) {
      ctx.done(err);
    }


}

module.exports = dpdapn;
