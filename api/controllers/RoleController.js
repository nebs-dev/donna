/**
 * RoleController
 *
 * @description :: Server-side logic for managing roles
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * Roles list
     * @param req
     * @param res
     */
    list: function (req, res) {
        Role.find().then(function (roles) {
            return res.ok(roles);
        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

