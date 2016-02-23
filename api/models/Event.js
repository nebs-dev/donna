/**
 * Event.js
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

        link: {
            type: 'string',
            required: true,
            url: true
        },

        date: {
            type: 'date',
            required: true
        },

        showTime: {
            type: 'boolean',
            defaultsTo: false
        },

        location: {
            type: 'string'
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
            obj.commentsNum = obj.comments ? obj.comments.length : 0;
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

        Event.findOne(valuesToUpdate.id).populate('file').then(function (eventOld) {
            if (!valuesToUpdate.hasFiles || !eventOld.file) return cb();

            // destroy old file in database && file
            Media.destroy(eventOld.file.id).then(function () {
                return cb();
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

