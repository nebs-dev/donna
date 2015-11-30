/**
 * CommentNews.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    schema: true,

    attributes: {

        text: {
            type: 'string',
            required: true
        },

        user: {
            model: 'user',
            required: true
        },

        likes: {
            type: 'array',
            defaultsTo: []
        },

        reports: {
            type: 'array',
            defaultsTo: []
        },

        toJSON: function () {
            var obj = this.toObject();
            obj.likesNum = obj.likes.length;
            obj.reportsNum = obj.reports.length;
            return obj;
        }
    }
};

