/**
 * News.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var fs = require('fs-extra');
module.exports = {

    schema: true,

    attributes: {

        title: {
            type: 'string',
            required: true
        },

        text: {
            type: 'text',
            required: true
        },

        file: {
            type: 'string'
        },

        comments: {
            collection: 'commentNews',
            via: 'news'
        }
    },

    /**
     * @param valuesToUpdate
     * @param cb
     * @returns {*}
     */
    beforeUpdate: function (valuesToUpdate, cb) {
        if(!valuesToUpdate.file) return cb();

        News.findOne(valuesToUpdate.id).then(function (newsOld) {
            var filePath = 'uploads/news/' + newsOld.file;

            fs.remove(filePath, function (err) {
                if (err) return cb(err);
                cb();
            });

        }).catch(function (err) {
           return cb(err);
        });
    },

    /**
     * @param destroyedRecords
     * @param cb
     * @returns {*}
     */
    afterDestroy: function (destroyedRecords, cb) {
        if (!destroyedRecords.length) return cb();

        var filePath = 'uploads/news/' + destroyedRecords[0].file;

        fs.remove(filePath, function (err) {
            if (err) return cb(err);
            cb();
        });
    }

};

