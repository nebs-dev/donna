/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');

module.exports = {

    schema: true,

    attributes: {
        email: {
            type: 'email',
            unique: true
        },

        firstName: {
            type: 'string'
        },

        lastName: {
            type: 'string'
        },

        encryptedPassword: {
            type: 'string'
        },

        secret: {
            type: 'string',
            required: false
        },

        facebookId: {
            type: 'string',
            defaultsTo: null
        },

        googleId: {
            type: 'string',
            defaultsTo: null
        },

        isActive: {
            type: 'boolean',
            defaultsTo: false
        },

        isVIP: {
            type: 'boolean',
            defaultsTo: false
        },

        isOnline: {
            type: 'boolean',
            defaultsTo: false
        },

        reported: {
            type: 'date',
            required: false
        },

        file: {
            model: 'media'
        },

        licence: {
            model: 'licence'
        },

        role: {
            model: 'role'
        },

        comments: {
            collection: 'comment',
            via: 'user'
        },

        messages: {
            collection: 'message',
            via: 'user'
        },

        toJSON: function () {
            var obj = this.toObject();
            delete obj.encryptedPassword;
            delete obj.comments;
            delete obj.messages;
            delete obj.secret;
            return obj;
        }
    },


    beforeValidate: function (values, cb) {
        if (values.email) {
            values.email = values.email.toLowerCase();
        }
        cb();
    },

    /**
     * Set random secret
     * @param user
     * @returns {string}
     */
    setSecret: function (user) {
        var random = Math.random().toString(36).substring(7);

        if (user) {
            user.secret = random;
        }

        return random;
    },

    /**
     * Encrypt password and set secret before create
     * @param values
     * @param next
     */
    beforeCreate: function (values, next) {
        var _this = this;

        // If password is not set, only set user secret
        if (!values.password) {
            _this.setSecret(values);
            return next();
        }

        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(values.password, salt, function (err, hash) {
                if (err) return next(err);

                _this.setSecret(values);
                values.encryptedPassword = hash;
                next();
            });
        });
    },

    /**
     *
     * @param values
     * @param next
     * @returns {*}
     */
    beforeUpdate: function (values, next) {
        if (!values.password && !values.file) return next();

        if (values.file && values.hasFiles) {
            User.findOne(values.id).populate('file').then(function (userOld) {
                if (!values.hasFiles || !userOld.file) return next();

                // destroy old file in database && file
                Media.destroy(userOld.file.id).then(function () {
                    if (values.password) {
                        bcrypt.genSalt(10, function (err, salt) {
                            if (err) return next(err);

                            bcrypt.hash(values.password, salt, function (err, hash) {
                                if (err) return next(err);

                                values.encryptedPassword = hash;
                                return next();
                            });
                        });
                    }

                    return next();
                });

            }).catch(function (err) {
                return next(err);
            });

        } else {
            if (values.password) {
                bcrypt.genSalt(10, function (err, salt) {
                    if (err) return next(err);

                    bcrypt.hash(values.password, salt, function (err, hash) {
                        if (err) return next(err);

                        values.encryptedPassword = hash;
                        return next();
                    });
                });
            } else {
                return next();
            }
        }
    },

    /**
     * Check if password is valid
     * @param password
     * @param user
     * @param cb
     */
    validPassword: function (password, user, cb) {
        bcrypt.compare(password, user.encryptedPassword, function (err, match) {
            if (err) return cb(err);

            if (match) {
                return cb(null, true);
            } else {
                return cb(err);
            }
        });
    },

    /**
     * @param destroyedRecords
     * @param cb
     * @returns {*}
     */
    afterDestroy: function (destroyedRecords, cb) {
        if (!destroyedRecords.length) return cb();

        Media.destroy({id: destroyedRecords[0].file}).then(function () {
            Message.destroy({user: destroyedRecords[0].id}).then(function () {
                Comment.destroy({user: destroyedRecords[0].id}).then(function () {
                    return cb();
                });
            });
        }).catch(function (err) {
            return cb(err);
        });
    }
};

