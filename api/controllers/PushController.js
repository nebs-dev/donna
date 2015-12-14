/**
 * PushController
 *
 * @description :: Server-side logic for managing pushes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


    send: function (req, res) {
        var apn = require('apn');
        var options = {
            cert: sails.config.appPath + '/certs/DonnaVekicCertDev.pem',
            key: sails.config.appPath + '/certs/DonnaVekicKeyDev.pem',
            passphrase: '1234',
            gateway: 'gateway.sandbox.push.apple.com',
            port: 2195
        };

        var service = new apn.connection(options);

        Push.find({device: 'ios'}).then(function (data) {

            async.filter(data, function (obj, cb) {
                obj.badge = obj.badge + 1;
                obj.save(function (err, obj) {
                    if (err) return cb(false);

                    var note = new apn.notification();
                    note.badge = obj.badge;
                    note.setAlertText("Hello, from DonnaApp");

                    service.pushNotification(note, obj.deviceToken);
                    cb(true);
                });

            }, function (results) {
                return res.json(results);
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
            return res.json(data);
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
        Push.findOne({token: req.params.token}).then(function (obj) {
            obj.badges = 0;
            obj.save(function (err, obj) {
                if (err) return res.negotiate(err);

                return res.json(obj);
            });

        }).catch(function (err) {
           return res.negotiate(err);
        });
    }


};

