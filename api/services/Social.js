module.exports = {

    likeUnlike: function (req, model) {
        return new Promise(function (resolve, reject) {

            sails.models[model].findOne(req.params.id).populateAll().then(function (item) {
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
                    if (item.user && item.user.file) {
                        Media.findOne(item.user.file).then(function (media) {
                            media.url = sails.getBaseurl() + '/api/file/public/' + media.id;
                            media.thumb = sails.getBaseurl() + '/api/file/thumb/public/' + media.id;

                            item.user.file = media;
                            itemNew.user.file = media;
                            if (itemNew.user) itemNew.user.role = {};

                            sails.models[model].publishUpdate(itemNew.id, LikeHelper.checkLike(req, itemNew.toJSON()));
                            return resolve(itemNew.toJSON());
                        }).catch(function (err) {
                           return reject(err);
                        });
                    } else {
                        if (itemNew.user) itemNew.user.role = {};
                        sails.models[model].publishUpdate(itemNew.id, LikeHelper.checkLike(req, itemNew.toJSON()));
                        return resolve(itemNew.toJSON());
                    }
                });

            }).catch(function (err) {
                return reject(err);
            });
        });
    },

    reportUnreport: function (req, model) {
        return new Promise(function (resolve, reject) {

            sails.models[model].findOne(req.params.id).populateAll().then(function (item) {
                if (!item) return reject('Not found!');

                // REPORT
                if (item.reports.indexOf(req.token.userId) === -1) {
                    item.reports.push(req.token.userId);

                // UNREPORT
                } else {
                    item.reports = _.without(item.reports, req.token.userId);
                }

                item.save(function (err, itemNew) {
                    if (item.user.file) {
                        Media.findOne(item.user.file).then(function (media) {
                            media.url = sails.getBaseurl() + '/api/file/public/' + media.id;
                            media.thumb = sails.getBaseurl() + '/api/file/thumb/public/' + media.id;

                            item.user.file = media;
                            itemNew.user.file = media;
                            if (itemNew.user) itemNew.user.role = {};

                            sails.models[model].publishUpdate(itemNew.id, itemNew.toJSON());
                            return resolve(itemNew.toJSON());
                        }).catch(function (err) {
                            return reject(err);
                        });
                    } else {
                        if (itemNew.user) itemNew.user.role = {};
                        sails.models[model].publishUpdate(itemNew.id, itemNew.toJSON());
                        return resolve(itemNew.toJSON());
                    }
                });

            }).catch(function (err) {
                return reject(err);
            });
        });
    }

};