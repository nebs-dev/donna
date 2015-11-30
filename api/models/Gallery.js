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
            collection: 'file'
        }
    },

    beforeDestroy: function (criteria, cb) {
        Gallery.findOne(criteria).populate('files').then(function (gallery) {
            var ids = _.pluck(gallery.files, 'id');
            if (!ids.length) return cb();

            File.destroy({id: ids}).then(function () {
                return cb();
            });

        }).catch(function (err) {
            return cb(err);
        });
    }
};

