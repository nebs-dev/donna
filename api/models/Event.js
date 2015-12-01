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
            model: 'file'
        },

        toJSON: function () {
            var obj = this.toObject();
            obj.likesNum = obj.likes.length;
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
            // destroy old file in database && file
            File.destroy(eventOld.file.id).then(function () {
                var filePath = 'uploads/' + eventOld.file.url;

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

        var filePath = 'uploads/event/' + destroyedRecords[0].file;

        fs.remove(filePath, function (err) {
            if (err) return cb(err);
            cb();
        });
    }
};

