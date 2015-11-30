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

        news: {
            model: 'news'
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

        var filePath = 'uploads/' + destroyedRecords[0].url;

        fs.remove(filePath, function (err) {
            if (err) return cb(err);

            cb();
        });
    }
};
