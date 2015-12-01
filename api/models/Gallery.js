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
    }
};

