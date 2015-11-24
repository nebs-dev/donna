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

        news: {
            model: 'news',
            required: true
        },

        user: {
            model: 'user',
            required: true
        }
    }
};

