/**
 * PushController
 *
 * @description :: Server-side logic for managing pushes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
            timeToLive: 3,
            restrictedPackageName: "com.gauss.donavekic",
            dryRun: true,
            data: {
                title: 'DonnaVekic App',
                body: params.text
            },
            notification: {
                title: "DonnaVekic App",
                icon: "ic_launcher",
                body: params.text
            }
        });


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
                        var regToken = obj.deviceToken;

                        sender.send(message, { to: regToken }, function (err, response) {
                            if(err) cb(false);

                            console.log(response);
                            cb(true);
                        });
                    });
                }

            }, function (results) {
                console.log('----------------------------------------------', results);
                return res.ok(results);
            });

        }).catch(function (err) {
           return res.negotiate(err);
        });
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
            return res.negotiate(err);
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

