/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    /**
     * Login user
     * @param req
     * @param res
     * @returns {*}
     */
    login: function (req, res) {
        var email = req.param('email');
        var password = req.param('password');

        if (!email || !password) return res.customBadRequest('Missing Parameters.');

        User.findOne({email: email}).populate('role').populate('file').then(function (user) {
            if (!user) return res.accessDenied('Invalid email or password');

            User.validPassword(password, user, function (err, valid) {
                if (err) return res.accessDenied();

                if (!valid) {
                    return res.accessDenied('Invalid email or password');
                } else {
                    var token = sailsTokenAuth.issueToken({userId: user.id, ip: req.ip, secret: user.secret});
                    if (user.file) {
                        user.file.url = sails.getBaseurl() + '/api/file/' + user.file.id + '?token=' + token;
                        user.file.thumb = sails.getBaseurl() + '/api/file/thumb/' + user.file.id + '?token=' + token;
                    }

                    res.ok({user: user, token: token});
                }
            });
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Register user
     * @param req
     * @param res
     */
    register: function (req, res) {
        var params = req.params.all();

        if (!params.firstName || !params.lastName || !params.email) return res.customBadRequest('Missing parameters.');

        if (params.password !== params.confirmPassword) {
            return res.customBadRequest('Password doesn\'t match');
        }

        // Create user and attach role "user" to him
        User.create(params).then(function (user) {
            return [user, UploadHelper.uploadFile(req, 'user')];

        }).spread(function (user, files) {
            Role.findOne({name: 'user'}).then(function (role) {
               if (!role) return res.notFound('Role "user" not found');

                if (files) {
                    user.hasFiles = true;
                    user.file = files[0].id;
                }
                user.role = role;
                user.save(function (err, user) {
                   if (err) return res.negotiate(err);

                    var token = sailsTokenAuth.issueToken({userId: user.id, ip: req.ip, secret: user.secret});
                    res.ok({user: UploadHelper.getFullUrl(req, user), token: token});
                });
            });

        }).catch(function (err) {
           return res.negotiate(err);
        });
    },

    /**
     * nebs: 100003197765742, hrca: 100005429524842
     * Register/Login with facebook
     * @param req
     * @param res
     * @returns {*}
     */
    facebook: function (req, res) {
        var params = req.params.all();
        if (!params.facebookId) return res.customBadRequest('Missing parameters.');

        User.findOne({facebookId: params.facebookId}).populateAll().then(function (user) {

            // User login
            if (user) {
                var token = sailsTokenAuth.issueToken({userId: user.id, ip: req.ip, secret: user.secret});
                return res.ok({user: UploadHelper.getFullUrl(req, user), token: token});
            }

            // Check email / login
            if (!params.email) return res.customBadRequest('Missing parameters (email).');
            User.findOne({email: params.email}).then(function (user) {
                if (user) {
                    var token = sailsTokenAuth.issueToken({userId: user.id, ip: req.ip, secret: user.secret});
                    return res.ok({user: UploadHelper.getFullUrl(req, user), token: token});
                }

                // User registration
                User.create(params).then(function (user) {
                    return [user, UploadHelper.uploadFile(req, 'user')];

                }).spread(function (user, files) {
                    Role.findOne({name: 'user'}).then(function (role) {
                        if (!role) return res.notFound('Role "user" not found');

                        if (files) {
                            user.hasFiles = true;
                            user.file = files[0].id;
                        }
                        user.role = role;
                        user.save(function (err, user) {
                            if (err) return res.negotiate(err);

                            var token = sailsTokenAuth.issueToken({userId: user.id, ip: req.ip, secret: user.secret});
                            user.file = files[0];
                            res.ok({user: UploadHelper.getFullUrl(req, user), token: token});
                        });
                    });
            });

            }).catch(function (err) {
                return res.negotiate(err);
            });

        }).catch(function (err) {
           return res.negotiate(err);
        });
    },

    /**
     * Register/Login with google+
     * @param req
     * @param res
     * @returns {*}
     */
    google: function (req, res) {
        var params = req.params.all();
        if (!params.googleId) return res.customBadRequest('Missing parameters.');

        User.findOne({googleId: params.googleId}).populateAll().then(function (user) {

            // User login
            if (user) {
                var token = sailsTokenAuth.issueToken({userId: user.id, ip: req.ip, secret: user.secret});
                return res.ok({user: UploadHelper.getFullUrl(req, user), token: token});
            }

            // Check email / login
            if (!params.email) return res.customBadRequest('Missing parameters (email).');
            User.findOne({email: params.email}).then(function (user) {
                if (user) {
                    var token = sailsTokenAuth.issueToken({userId: user.id, ip: req.ip, secret: user.secret});
                    return res.ok({user: UploadHelper.getFullUrl(req, user), token: token});
                }

                // User registration
                User.create(params).then(function (user) {
                    return [user, UploadHelper.uploadFile(req, 'user')];

                }).spread(function (user, files) {
                    Role.findOne({name: 'user'}).then(function (role) {
                        if (!role) return res.notFound('Role "user" not found');

                        if (files) {
                            user.hasFiles = true;
                            user.file = files[0].id;
                        }
                        user.role = role;
                        user.save(function (err, user) {
                            if (err) return res.negotiate(err);

                            var token = sailsTokenAuth.issueToken({userId: user.id, ip: req.ip, secret: user.secret});
                            user.file = files[0];
                            res.ok({user: UploadHelper.getFullUrl(req, user), token: token});
                        });
                    });
                });

            }).catch(function (err) {
                return res.negotiate(err);
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

