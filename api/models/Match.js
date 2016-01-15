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

        opponent1: {
            type: 'string',
            required: true
        },

        opponent2: {
            type: 'string',
            required: true
        },

        messages: {
            collection: 'matchMessage',
            via: 'match'
        }
    },

    /**
     * Delete all messages for destroyed match
     * @param destroyedRecords
     * @param cb
     * @returns {*}
     */
    afterDestroy: function (destroyedRecords, cb) {
        if (!destroyedRecords.length) return cb();

        MatchMessage.destroy({match: destroyedRecords[0].id}).then(function () {
            return cb();
        }).catch(function (err) {
            return cb(err);
        });
    },

    /**
     *
     * @param id
     * @param alias
     * @param added
     * @param req
     * @param options
     * @returns {*}
     */
    publishAdd: function (id, alias, added, req, options) {
        var reverseAssociation;

        var addedEntry = added;
        added = added.id || added;

        // Make sure there's an options object
        options = options || {};

        // Enforce valid usage
        var invalidId = !id || _.isObject(id);
        var invalidAlias = !alias || !_.isString(alias);
        var invalidAddedId = !added || _.isArray(added);
        if (invalidId || invalidAlias || invalidAddedId) {
            return sails.log.error(
                'Invalid usage of `' + this.identity +
                '.publishAdd(id, alias, idAdded|recordAdded, [socketToOmit])`'
            );
        }

        // Get the model on the opposite side of the association
        var reverseModel = sails.models[_.find(this.associations, {alias: alias}).collection];

        // Determine whether `added` was provided as a pk value or an object
        var idAdded;

        // If it is a pk value, we'll turn it into `idAdded`:
        if (!_.isObject(added)) {
            idAdded = added;
            added = undefined;
        }
        // Otherwise we'll leave it as `added` for use below, and determine `idAdded` by examining the object
        // using our knowledge of what the name of the primary key attribute is.
        else {
            idAdded = added[reverseModel.primaryKey];

            // If we don't find a primary key value, we'll log an error and return early.
            if (!_.isString(idAdded) && !_.isNumber(idAdded)) {
                sails.log.error(
                    'Invalid usage of publishAdd(): expected object provided ' +
                    'for `recordAdded` to have a "%s" attribute', reverseModel.primaryKey
                );
                return;
            }
        }

        // Lifecycle event
        if (sails.util.isFunction(this.beforePublishAdd)) {
            this.beforePublishAdd(id, alias, idAdded, req);
        }

        // If a request object was sent, get its socket, otherwise assume a socket was sent.
        var socketToOmit = (req && req.socket ? req.socket : req);


        // In development environment, blast out a message to everyone
        sails.sockets.publishToFirehose({
            id: id,
            model: this.identity,
            verb: 'addedTo',
            attribute: alias,
            addedId: idAdded
        });

        this.publish(id, this.identity, 'add:' + alias, (function () {
            var event = {
                id: id,
                verb: 'addedTo',
                attribute: alias,
                addedId: idAdded,
                data: addedEntry
            };
            if (added) {
                event.added = added;
            }
            return event;
        })(), socketToOmit);

        if (!options.noReverse) {

            var data;

            // Subscribe to the model you're adding
            if (req && req.isSocket) {
                data = {};
                data[reverseModel.primaryKey] = idAdded;
                reverseModel.subscribe(req, data);
            }

            // Find the reverse association, if any
            reverseAssociation = _.find(reverseModel.associations, {alias: _.find(this.associations, {alias: alias}).via});
            if (reverseAssociation) {
                // If this is a many-to-many association, do a publishAdd for the
                // other side.
                if (reverseAssociation.type == 'collection') {
                    reverseModel.publishAdd(idAdded, reverseAssociation.alias, id, req, {noReverse: true});
                }

                // Otherwise, do a publishUpdate
                else {
                    data = {};
                    data[reverseAssociation.alias] = id;
                    reverseModel.publishUpdate(idAdded, data, req, {noReverse: true});
                }
            }

        }


        if (sails.util.isFunction(this.afterPublishAdd)) {
            this.afterPublishAdd(id, alias, idAdded, req);
        }

    },

    publishRemove: function(id, alias, idRemoved, req, options) {

        var removedEntry = idRemoved;
        idRemoved = removedEntry.id || idRemoved;

        // Make sure there's an options object
        options = options || {};

        // Enforce valid usage
        var invalidId = !id || _.isObject(id);
        var invalidAlias = !alias || !_.isString(alias);
        var invalidRemovedId = !idRemoved || _.isObject(idRemoved);
        if ( invalidId || invalidAlias || invalidRemovedId ) {
            return sails.log.error(
                'Invalid usage of `' + this.identity +
                '.publishRemove(id, alias, idRemoved, [socketToOmit])`'
            );
        }
        if (sails.util.isFunction(this.beforePublishRemove)) {
            this.beforePublishRemove(id, alias, idRemoved, req);
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

        // If a request object was sent, get its socket, otherwise assume a socket was sent.
        var socketToOmit = (req && req.socket ? req.socket : req);

        // In development environment, blast out a message to everyone
        sails.sockets.publishToFirehose({
            id: id,
            model: this.identity,
            verb: 'removedFrom',
            attribute: alias,
            removedId: idRemoved
        });

        this.publish(id, this.identity, 'remove:' + alias, {
            id: id,
            verb: 'removedFrom',
            attribute: alias,
            removedId: idRemoved,
            data: removedEntry
        }, socketToOmit);


        if (!options.noReverse) {

            // Get the reverse association, if any
            var reverseModel = sails.models[_.find(this.associations, {alias: alias}).collection];
            var reverseAssociation = _.find(reverseModel.associations, {alias: _.find(this.associations, {alias: alias}).via});

            if (reverseAssociation) {
                // If this is a many-to-many association, do a publishAdd for the
                // other side.
                if (reverseAssociation.type == 'collection') {
                    reverseModel.publishRemove(idRemoved, reverseAssociation.alias, id, req, {noReverse:true});
                }

                // Otherwise, do a publishUpdate
                else {
                    var data = {};
                    data[reverseAssociation.alias] = null;
                    reverseModel.publishUpdate(idRemoved, data, req, {noReverse:true});
                }
            }

        }

        if (sails.util.isFunction(this.afterPublishRemove)) {
            this.afterPublishRemove(id, alias, idRemoved, req);
        }

    }
};

