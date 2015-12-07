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
    }

};

