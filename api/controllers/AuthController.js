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

        User.findOneByEmail(email, function (err, user) {
            if (!user) return res.accessDenied('Invalid email or password');

            User.validPassword(password, user, function (err, valid) {
                if (err) return res.accessDenied();

                if (!valid) {
                    return res.accessDenied('invalid email or password');
                } else {
                    res.json({user: user, token: sailsTokenAuth.issueToken({userId: user.id, secret: user.secret})});
                }
            });
        })
    },

    /**
     * Register user
     * @param req
     * @param res
     */
    register: function (req, res) {
        if (req.body.password !== req.body.confirmPassword) {
            return res.customBadRequest('Password doesn\'t match');
        }

        User.create({email: req.body.email, password: req.body.password}).exec(function (err, user) {
            if (err) {
                res.json(err.status, {err: err});
                return;
            }
            if (user) {
                res.json({user: user, token: sailsTokenAuth.issueToken({userId: user.id, secret: user.secret})});
            }
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

        User.findOne({facebookId: params.facebookId}).then(function (user) {

            // User login
            if (user) {
                var token = sailsTokenAuth.issueToken({userId: user.id, secret: user.secret});
                return res.json({user: user, token: token});
            }

            // User registration
            User.create(params).then(function (user) {
                var token = sailsTokenAuth.issueToken({userId: user.id, secret: user.secret});
                return res.json({user: user, token: token});
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

        User.findOne({googleId: params.googleId}).then(function (user) {

            // User login
            if (user) {
                var token = sailsTokenAuth.issueToken({userId: user.id, secret: user.secret});
                return res.json({user: user, token: token});
            }

            // User registration
            User.create(params).then(function (user) {
                var token = sailsTokenAuth.issueToken({userId: user.id, secret: user.secret});
                return res.json({user: user, token: token});
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

