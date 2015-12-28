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
        User.find().populate('role').then(function (users) {
            return res.ok(users);
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
        User.findOne(req.params.id).then(function (user) {
            return res.ok(user);
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


    resetPassword: function (req, res) {
        var params = req.params.all();

        User.findOne(params.email).then(function (user) {
            var newPassword = Math.random().toString(36).substring(7);

            user.password = newPassword;
            user.save(function (err, user) {
                if (err) return res.negotiate(err);

                user.password = newPassword;
                return res.ok(user);
            });
        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

