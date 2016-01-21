/**
 * PushController
 *
 * @description :: Server-side logic for managing pushes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */



Object.defineProperty(Array.prototype, 'chunk', {
    value: function(chunkSize) {
        var R = [];
        for (var i=0; i<this.length; i+=chunkSize)
            R.push(this.slice(i,i+chunkSize));
        return R;
    }
});


module.exports = {

    /**
     * Send push notifications
     * @param req
     * @param res
     * @returns {*}
     */
    send: function (req, res) {
        var params = req.params.all();
        if (!params.text) return res.customBadRequest('push text is mandatory');

        /// IOS ///
        var apn = require('apn');
        var optionsIOS = {
            cert: sails.config.appPath + '/certs/DonnaVekicCertDev.pem',
            key: sails.config.appPath + '/certs/DonnaVekicKeyDev.pem',
            passphrase: '1234',
            gateway: 'gateway.sandbox.push.apple.com',
            port: 2195
        };
        var serviceIOS = new apn.connection(optionsIOS);

        /// Android ///
        var gcm = require('node-gcm');
        // Set up the sender with you API key
        var sender = new gcm.Sender('AIzaSyC0Qqw9xnDPYUD6ZAGsmvCUzzMaYcYQZIU');
        // Message
        var message = new gcm.Message({
            collapseKey: 'demo',
            priority: 'high',
            contentAvailable: true,
            delayWhileIdle: true,
            timeToLive: 100,
            restrictedPackageName: "com.gauss.donavekic",
            data: {
                title: 'DonnaVekic App',
                body: params.text
            }
        });
        // All android tokens
        var regTokens = [];

        // Find all devices
        Push.find().then(function (data) {
            async.filter(data, function (obj, cb) {
                obj.badge = obj.badge + 1;

                // IOS push
                if (obj.device == 'ios') {
                    obj.save(function (err, obj) {
                        if (err) return cb(false);

                        var note = new apn.notification();
                        note.badge = obj.badge;
                        note.setAlertText(params.text);

                        serviceIOS.pushNotification(note, obj.deviceToken);
                        cb(true);
                    });

                // Android push
                } else if (obj.device == 'android') {
                    obj.save(function (err, obj) {
                        if (err) return cb(false);
                        regTokens.push(obj.deviceToken);
                        cb(true);
                    });
                }

            }, function (results) {
                var androidChunks = regTokens.chunk(500);

                sendChunks(message, androidChunks, function(err, done){
                    if(err) return res.serverError(err);
                    if(done) return res.ok(results);
                });

            });

        }).catch(function (err) {
            return res.negotiate(err);
        });


        function sendChunks(message, chunks, cb) {
            var chunk = chunks.shift();
            if (!chunk) return cb(false, true);

            sender.send(message, {registrationTokens: chunk}, function (err, response) {
                if (err) {
                    console.log("ne ide mi ovaj chunk bas", err, chunk);
                }

                console.log(response);
                sendChunks(message, chunks, cb);
            });
        }

    },

    /**
     * Create new token in db
     * @param req
     * @param res
     */
    registerToken: function (req, res) {
        var params = req.params.all();

        Push.create(params).then(function (data) {
            return res.ok(data);
        }).catch(function (err) {
            return res.status(err.status || 500).json(err);
        });
    },

    /**
     * Reset badges for device
     * @param req
     * @param res
     */
    resetBadges: function (req, res) {
        Push.findOne({deviceToken: req.params.deviceToken}).then(function (obj) {
            obj.badge = 0;
            obj.save(function (err, obj) {
                if (err) return res.negotiate(err);

                return res.ok(obj);
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    }


};

