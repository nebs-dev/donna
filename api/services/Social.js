module.exports = {

    likeUnlike: function (req, model) {
        return new Promise(function (resolve, reject) {

            sails.models[model].findOne(req.params.id).then(function (item) {
                if (!item) return reject('Not found!');
                if (!item.likes) return reject();

                // LIKE
                if (item.likes.indexOf(req.token.userId) === -1) {
                    item.likes.push(req.token.userId);

                // UNLIKE
                } else {
                    item.likes = _.without(item.likes, req.token.userId);
                }

                item.save(function (err, itemNew) {
                    sails.models[model].publishUpdate(itemNew.id, itemNew.toJSON());
                    return resolve(item);
                });

            }).catch(function (err) {
                return reject(err);
            });
        });
    },

    reportUnreport: function (req, model) {
        return new Promise(function (resolve, reject) {

            sails.models[model].findOne(req.params.id).then(function (item) {
                if (!item) return reject('Not found!');

                // REPORT
                if (item.reports.indexOf(req.token.userId) === -1) {
                    item.reports.push(req.token.userId);

                // UNREPORT
                } else {
                    item.reports = _.without(item.reports, req.token.userId);
                }

                item.save(function (err, itemNew) {
                    sails.models[model].publishUpdate(itemNew.id, itemNew.toJSON());

                    return resolve(item);
                });

            }).catch(function (err) {
                return reject(err);
            });
        });
    }

};