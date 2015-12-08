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

        likes: {
            type: 'array',
            defaultsTo: []
        },

        comments: {
            collection: 'comment'
        },

        file: {
            model: 'media'
        },

        toJSON: function () {
            var obj = this.toObject();
            obj.likesNum = obj.likes.length;
            obj.commentsNum = obj.comments.length;
            return obj;
        }
    },

    /**
     * @param valuesToUpdate
     * @param cb
     * @returns {*}
     */
    beforeUpdate: function (valuesToUpdate, cb) {
        if (!valuesToUpdate.file) return cb();

        News.findOne(valuesToUpdate.id).populate('file').then(function (newsOld) {
            if (!newsOld.file) return cb();

            // destroy old file in database && file
            Media.destroy(newsOld.file.id).then(function () {
                var filePath = 'uploads/' + newsOld.file.url;

                fs.remove(filePath, function (err) {
                    if (err) return cb(err);
                    cb();
                });
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

