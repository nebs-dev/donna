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


    // overwrite za bata
    publishUpdate: function (id, changes, req, options) {

        // Make sure there's an options object
        options = options || {};

        // Ensure that we're working with a clean, unencumbered object
        changes = _.cloneDeep(changes);

        // Enforce valid usage
        var validId = _.isString(id) || _.isFinite(id);
        if ( !validId  ) {
            return sails.log.error(
                'Invalid usage of `' + this.identity +
                '.publishUpdate(id, changes, [socketToOmit])`'
            );
        }

        if (sails.util.isFunction(this.beforePublishUpdate)) {
            this.beforePublishUpdate(id, changes, req, options);
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
            verb: 'update',
            data: changes,
            id: id
        };

        if (options.previous && !options.noReverse) {

            var previous = options.previous;

            // If any of the changes were to association attributes, publish add or remove messages.
            _.each(changes, function(val, key) {

                // If value wasn't changed, do nothing
                if (val == previous[key]) return;

                // Find an association matching this attribute
                var association = _.find(this.associations, {alias: key});

                // If the attribute isn't an assoctiation, return
                if (!association) return;

                // Get the associated model class
                var ReferencedModel = sails.models[association.type == 'model' ? association.model : association.collection];

                // Bail if this attribute isn't in the model's schema
                if (association.type == 'model') {

                    var previousPK = _.isObject(previous[key]) ? previous[key][ReferencedModel.primaryKey] : previous[key];
                    var newPK = _.isObject(val) ? val[this.primaryKey] : val;
                    if (previousPK == newPK) return;

                    // Get the inverse association definition, if any
                    reverseAssociation = _.find(ReferencedModel.associations, {collection: this.identity, via: key}) || _.find(ReferencedModel.associations, {model: this.identity, via: key});

                    if (!reverseAssociation) {return;}

                    // If this is a to-many association, do publishAdd or publishRemove as necessary
                    // on the other side
                    if (reverseAssociation.type == 'collection') {
                        // If there was a previous value, alert the previously associated model
                        if (previous[key]) {
                            ReferencedModel.publishRemove(previousPK, reverseAssociation.alias, id, req, {noReverse:true});
                        }
                        // If there's a new value (i.e. it's not null), alert the newly associated model
                        if (val) {
                            ReferencedModel.publishAdd(newPK, reverseAssociation.alias, id, req, {noReverse:true});
                        }
                    }
                    // Otherwise do a publishUpdate
                    else {

                        var pubData = {};

                        // If there was a previous association, notify it that it has been nullified
                        if (previous[key]) {
                            pubData[reverseAssociation.alias] = null;
                            ReferencedModel.publishUpdate(previousPK, pubData, req, {noReverse:true});
                        }
                        // If there's a new association, notify it that it has been linked
                        if (val) {
                            pubData[reverseAssociation.alias] = id;
                            ReferencedModel.publishUpdate(newPK, pubData, req, {noReverse:true});
                        }

                    }

                }

                else {

                    // Get the reverse association definition, if any
                    reverseAssociation = _.find(ReferencedModel.associations, {collection: this.identity, via: key}) || _.find(ReferencedModel.associations, {model: this.identity, alias: association.via});

                    if (!reverseAssociation) {return;}

                    // If we can't get the previous PKs (b/c previous isn't populated), bail
                    if (typeof(previous[key]) == 'undefined') return;

                    // Get the previous set of IDs
                    var previousPKs = _.pluck(previous[key], ReferencedModel.primaryKey);
                    // Get the current set of IDs
                    var updatedPKs = _.map(val, function(_val) {
                        if (_.isObject(_val)) {
                            return _val[ReferencedModel.primaryKey];
                        } else {
                            return _val;
                        }
                    });
                    // Find any values that were added to the collection
                    var addedPKs = _.difference(updatedPKs, previousPKs);
                    // Find any values that were removed from the collection
                    var removedPKs = _.difference(previousPKs, updatedPKs);

                    // If this is a to-many association, do publishAdd or publishRemove as necessary
                    // on the other side
                    if (reverseAssociation.type == 'collection') {

                        // Alert any removed models
                        _.each(removedPKs, function(pk) {
                            ReferencedModel.publishRemove(pk, reverseAssociation.alias, id, req, {noReverse:true});
                        });
                        // Alert any added models
                        _.each(addedPKs, function(pk) {
                            ReferencedModel.publishAdd(pk, reverseAssociation.alias, id, req, {noReverse:true});
                        });

                    }

                    // Otherwise do a publishUpdate
                    else {

                        // Alert any removed models
                        _.each(removedPKs, function(pk) {
                            var pubData = {};
                            pubData[reverseAssociation.alias] = null;
                            ReferencedModel.publishUpdate(pk, pubData, req, {noReverse:true});
                        });
                        // Alert any added models
                        _.each(addedPKs, function(pk) {
                            var pubData = {};
                            pubData[reverseAssociation.alias] = id;
                            ReferencedModel.publishUpdate(pk, pubData, req, {noReverse:true});
                        });

                    }

                }
            }, this);
        }

        // If a request object was sent, get its socket, otherwise assume a socket was sent.
        var socketToOmit = (req && req.socket ? req.socket : req);

        // In development environment, blast out a message to everyone
        sails.sockets.publishToFirehose(data);

        data.verb = 'updated';
        data.previous = options.previous;
        delete data.model;

        // Broadcast to the model instance room
        // changed this.publish(id, this.identity, 'update', data, socketToOmit);
        this.publish(id, 'chatMessage', 'update', data, socketToOmit);

        if (sails.util.isFunction(this.afterPublishUpdate)) {
            this.afterPublishUpdate(id, changes, req, options);
        }


    },

    publishCreate: function(values, req, options) {
        var self = this;

        options = options || {};

        if (!values[this.primaryKey]) {
            return sails.log.error(
                'Invalid usage of publishCreate() :: ' +
                'Values must have an `'+this.primaryKey+'`, instead got ::\n' +
                util.inspect(values)
            );
        }

        if (sails.util.isFunction(this.beforePublishCreate)) {
            this.beforePublishCreate(values, req);
        }

        var id = values[this.primaryKey];

        // Coerce id to match the attribute type of the primary key of the model
        try {
            var pkAttrDef = this.attributes[this.primaryKey];
            if (pkAttrDef.type === 'integer') {  id = +id; }
            else if (pkAttrDef.type === 'string') { id = id+''; }
        }
        catch(e){
            // well... worth a shot
        }

        // If any of the added values were association attributes, publish add or remove messages.
        _.each(values, function(val, key) {

            // If the user hasn't yet given this association a value, bail out
            if (val === null) {
                return;
            }

            var association = _.find(this.associations, {alias: key});

            // If the attribute isn't an assoctiation, return
            if (!association) return;

            // Get the associated model class
            var ReferencedModel = sails.models[association.type == 'model' ? association.model : association.collection];

            // Bail if the model doesn't exist
            if (!ReferencedModel) return;

            // Bail if this attribute isn't in the model's schema
            if (association.type == 'model') {

                // Get the inverse association definition, if any
                reverseAssociation = _.find(ReferencedModel.associations, {collection: this.identity, via: key}) || _.find(ReferencedModel.associations, {model: this.identity, via: key});

                if (!reverseAssociation) {return;}

                // If this is a to-many association, do publishAdd on the other side
                // TODO -- support nested creates.  For now, we can't tell if an object value here represents
                // a NEW object or an existing one, so we'll ignore it.
                if (reverseAssociation.type == 'collection' && !_.isObject(val)) {
                    ReferencedModel.publishAdd(val, reverseAssociation.alias, id, req, {noReverse:true});
                }
                // Otherwise do a publishUpdate
                // TODO -- support nested creates.  For now, we can't tell if an object value here represents
                // a NEW object or an existing one, so we'll ignore it.
                else {

                    var pubData = {};

                    if (!_.isObject(val)) {
                        pubData[reverseAssociation.alias] = id;
                        ReferencedModel.publishUpdate(val, pubData, req, {noReverse:true});
                    }

                }

            }

            else {

                // Get the inverse association definition, if any
                reverseAssociation = _.find(ReferencedModel.associations, {collection: this.identity, via: key}) || _.find(ReferencedModel.associations, {model: this.identity, alias: association.via});

                if (!reverseAssociation) {return;}

                // If this is a to-many association, do publishAdds on the other side
                if (reverseAssociation.type == 'collection') {

                    // Alert any added models
                    _.each(val, function(pk) {
                        // TODO -- support nested creates.  For now, we can't tell if an object value here represents
                        // a NEW object or an existing one, so we'll ignore it.
                        if (_.isObject(pk)) return;
                        ReferencedModel.publishAdd(pk, reverseAssociation.alias, id, req, {noReverse:true});
                    });

                }

                // Otherwise do a publishUpdate
                else {

                    // Alert any added models
                    _.each(val, function(pk) {
                        // TODO -- support nested creates.  For now, we can't tell if an object value here represents
                        // a NEW object or an existing one, so we'll ignore it.
                        if (_.isObject(pk)) return;
                        var pubData = {};
                        pubData[reverseAssociation.alias] = id;
                        ReferencedModel.publishUpdate(pk, pubData, req, {noReverse:true});
                    });

                }

            }

        }, this);

        // Ensure that we're working with a plain object
        values = _.clone(values);

        // If a request object was sent, get its socket, otherwise assume a socket was sent.
        var socketToOmit = (req && req.socket ? req.socket : req);

        // Blast success message
        sails.sockets.publishToFirehose({

            model: this.identity,
            verb: 'create',
            data: values,
            id: values[this.primaryKey]

        });

        // Publish to classroom
        var eventName = 'chatMessage'; // changed this.identity;
        this.broadcast(this._classRoom(), eventName, {
            verb: 'created',
            data: values,
            id: values[this.primaryKey]
        }, socketToOmit);

        // Also broadcasts a message to the legacy class room (derived by
        // using the `:legacy_v0.9` trailer on the class room name).
        // Uses traditional eventName === "message".
        // Uses traditional message format.
        if (sails.config.sockets['backwardsCompatibilityFor0.9SocketClients']) {
            var legacyData = _.cloneDeep({
                verb: 'create',
                data: values,
                model: self.identity,
                id: values[this.primaryKey]
            });
            var legacyRoom = this._classRoom()+':legacy_v0.9';
            // changed self.broadcast( legacyRoom, 'message', legacyData, socketToOmit );
            self.broadcast( legacyRoom, eventName, legacyData, socketToOmit );
        }

        // Subscribe watchers to the new instance
        if (!options.noIntroduce) {
            this.introduce(values[this.primaryKey]);
        }

        if (sails.util.isFunction(this.afterPublishCreate)) {
            this.afterPublishCreate(values, req);
        }

    }
};

