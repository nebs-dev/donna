/**
 * Gallery.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    schema: true,

    attributes: {

        title: {
            type: 'string',
            required: true
        },

        files: {
            collection: 'media'
        },

        file: {
            model: 'media'
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
            obj.commentsNum = obj.comments ? obj.comments.length : 0;
            return obj;
        }
    },

    beforeDestroy: function (criteria, cb) {
        Gallery.findOne(criteria).populate('files').then(function (gallery) {
            var ids = _.pluck(gallery.files, 'id');
            if (!ids.length) return cb();

            Media.destroy({id: ids}).then(function () {
                return cb();
            });

        }).catch(function (err) {
            return cb(err);
        });
    },

    /**
     * @param valuesToUpdate
     * @param cb
     * @returns {*}
     */
    beforeUpdate: function (valuesToUpdate, cb) {
        if (!valuesToUpdate.file) return cb();

        Gallery.findOne(valuesToUpdate.id).populate('file').then(function (galleryOld) {
            if (!valuesToUpdate.hasFiles || !galleryOld.file) return cb();

            // destroy old file in database && file
            Media.destroy(galleryOld.file.id).then(function () {
                return cb();
            }).catch(function (err) {
                return cb(err);
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

        Media.destroy({id: destroyedRecords[0].file}).then(function () {
            return cb();
        }).catch(function (err) {
            return cb(err);
        });
    }
};

