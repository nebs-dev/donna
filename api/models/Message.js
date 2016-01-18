/**
 * Chat.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    schema: true,

    attributes: {

        text: {
            type: 'text',
            required: true
        },

        user: {
            model: 'user'
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
    },


    publishDestroy: function (id, req, options) {

        var deletedEntry = id;
        id = id.id || id;

        options = options || {};

        // Enforce valid usage
        var invalidId = !id || _.isObject(id);
        if ( invalidId ) {
            return sails.log.error(
                'Invalid usage of `' + this.identity +
                '.publishDestroy(id, [socketToOmit])`'
            );
        }

        if (sails.util.isFunction(this.beforePublishDestroy)) {
            this.beforePublishDestroy(id, req, options);
        }

        // Coerce id to match the attribute type of the primary key of the model
        try {
            var pkAttrDef = this.attributes[this.primaryKey];
            if (pkAttrDef.type === 'integer') {  id = +id; }
            else if (pkAttrDef.type === 'string') { id = id+''; }
        }
        catch(e){
            // well... worth a shot
        }

        var data = {
            model: this.identity,
            verb: 'destroy',
            id: id,
            previous: options.previous,
            data: deletedEntry
        };

        // If a request object was sent, get its socket, otherwise assume a socket was sent.
        var socketToOmit = (req && req.socket ? req.socket : req);

        // In development environment, blast out a message to everyone
        sails.sockets.publishToFirehose(data);

        data.verb = 'destroyed';
        delete data.model;

        // Broadcast to the model instance room
        this.publish(id, this.identity, 'destroy', data, socketToOmit);

        // Unsubscribe everyone from the model instance
        this.retire(id);

        if (options.previous) {

            var previous = options.previous;

            // Loop through associations and alert as necessary
            _.each(this.associations, function(association) {

                var ReferencedModel;

                // If it's a to-one association, and it wasn't falsy, alert
                // the reverse side
                if (association.type == 'model' && [association.alias] && previous[association.alias]) {
                    ReferencedModel = sails.models[association.model];
                    // Get the inverse association definition, if any
                    reverseAssociation = _.find(ReferencedModel.associations, {collection: this.identity}) || _.find(ReferencedModel.associations, {model: this.identity});

                    if (reverseAssociation) {
                        // If it's a to-one, publish a simple update alert
                        var referencedModelId = _.isObject(previous[association.alias]) ? previous[association.alias][ReferencedModel.primaryKey] : previous[association.alias];
                        if (reverseAssociation.type == 'model') {
                            var pubData = {};
                            pubData[reverseAssociation.alias] = null;
                            ReferencedModel.publishUpdate(referencedModelId, pubData, req, {noReverse:true});
                        }
                        // If it's a to-many, publish a "removed" alert
                        else {
                            ReferencedModel.publishRemove(referencedModelId, reverseAssociation.alias, id, req, {noReverse:true});
                        }
                    }
                }

                else if (association.type == 'collection' && previous[association.alias].length) {
                    ReferencedModel = sails.models[association.collection];
                    // Get the inverse association definition, if any
                    reverseAssociation = _.find(ReferencedModel.associations, {collection: this.identity}) || _.find(ReferencedModel.associations, {model: this.identity});

                    if (reverseAssociation) {
                        _.each(previous[association.alias], function(associatedModel) {
                            // If it's a to-one, publish a simple update alert
                            if (reverseAssociation.type == 'model') {
                                var pubData = {};
                                pubData[reverseAssociation.alias] = null;
                                ReferencedModel.publishUpdate(associatedModel[ReferencedModel.primaryKey], pubData, req, {noReverse:true});
                            }
                            // If it's a to-many, publish a "removed" alert
                            else {
                                ReferencedModel.publishRemove(associatedModel[ReferencedModel.primaryKey], reverseAssociation.alias, id, req, {noReverse:true});
                            }
                        });
                    }
                }

            }, this);

        }

        if (sails.util.isFunction(this.afterPublishDestroy)) {
            this.afterPublishDestroy(id, req, options);
        }

    }
};

