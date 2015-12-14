/**
 * Push.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    schema: true,

    attributes: {
        deviceToken: {
            type: 'string',
            required: true
        },

        udid: {
            type: 'string',
            required: true
        },

        badge: {
            type: 'integer',
            defaultsTo: 0
        },

        device: {
            type: 'string',
            enum: ['android', 'ios'],
            required: true
        }

    }
};

