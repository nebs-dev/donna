/**
 * Match.js
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

        date: {
            type: 'date',
            required: true
        },

        opponents: {
            type: 'string',
            required: true
        },

        messages: {
            collection: 'matchMessage',
            via: 'match'
        }
    }
};

