/**
 * File.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var fs = require('fs-extra');
module.exports = {

    schema: true,

    attributes: {

        url: {
            type: 'string',
            required: true
        },

        likes: {
            type: 'array',
            defaultsTo: []
        },

        comments: {
            collection: 'comment'
        },

        toJSON: function () {
            var obj = this.toObject();
            obj.likesNum = obj.likes.length;
            return obj;
        }
    },

    /**
     * Remove file after object File destroyed
     * @param destroyedRecords
     * @param cb
     * @returns {*}
     */
    afterDestroy: function (destroyedRecords, cb) {
        if (!destroyedRecords.length) return cb();

        async.each(destroyedRecords, function(file, callback) {
            var filePath = 'uploads/' + file.url;

            fs.remove(filePath, function (err) {
                if (err) return callback(err);
                return callback();
            });

        }, function(err){
            if (err) return cb(err);
            return cb();
        });
    }
};
