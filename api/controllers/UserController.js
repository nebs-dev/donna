/**
 * UserController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * list of Users
     * @param req
     * @param res
     */
    list: function (req, res) {
        User.find().populate('role').populate('file').then(function (users) {
            return res.ok(UploadHelper.getFullUrl(req, users));
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Destroy user
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        User.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Show user
     * @param req
     * @param res
     */
    show: function (req, res) {
        User.findOne(req.params.id).populate('file').then(function (user) {
            return res.ok(UploadHelper.getFullUrl(req, user));
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    update: function (req, res) {
        var params = req.params.all();

        if (params.password !== params.confirmPassword) {
            return res.customBadRequest('Password doesn\'t match');
        }



        User.update(params.id, params).then(function (user) {
            return [user[0], UploadHelper.uploadFile(req, 'user')];

        }).spread(function (user, files) {
            if (!user) res.notFound('User with that id not found!');
            if (files) {
                user.hasFiles = true;
                user.file = files[0].id;
            }

            user.save(function (err, user) {
                if (err) return res.negotiate(err);

                return res.ok(UploadHelper.getFullUrl(req, user));
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Generate token and send email for reset user password
     * @param req
     * @param res
     */
    resetPassword: function (req, res) {
        var params = req.params.all();

        User.findOne({email: params.email}).then(function (user) {
            if (!user) return res.notFound('Email not found');

            var token = sailsTokenAuth.issueResetToken({userId: user.id, secret: user.secret});

            var link = sails.getBaseurl() + '/api/user/reset/' + token;
            var options = {
                to: user.email
            };

            EmailService.sendEmail(options, {link: link}, function (err, data) {
                if(err) return res.negotiate(err);

                return res.ok(data);
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },


    reset: function (req, res) {
        return res.ok('Password changed!!!');
    }

};

