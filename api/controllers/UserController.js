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
            return res.json(users);
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
            return res.json(user);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

