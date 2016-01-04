/**
 * NewsController
 *
 * @description :: Server-side logic for managing news
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

    /**
     * Create news && upload file
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        News.create(params).then(function (news) {

            return [news, UploadHelper.uploadFile(req, 'news')];

        }).spread(function (news, files) {
            if (files) news.file = files[0].id;

            news.save(function (err, news) {
                if (err) return res.negotiate(err);
                return res.ok(UploadHelper.getFullUrl(req, news));
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Update news && upload file
     * @param req
     * @param res
     */
    update: function (req, res) {
        var params = req.params.all();
        delete params.file;

        News.update(req.params.id, params).then(function (news) {
            return [news[0], UploadHelper.uploadFile(req, 'news')];

        }).spread(function (news, files) {
            if(!news) return res.notFound('News not found');
            if (files) {
                news.hasFiles = true;
                news.file = files[0].id;
            }

            news.save(function (err, news) {
                if (err) return res.negotiate(err);

                return res.ok(UploadHelper.getFullUrl(req, news));
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Destroy News
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        News.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Show single News
     * @param req
     * @param res
     */
    show: function (req, res) {
        News.findOne(req.params.id).populateAll().then(function (news) {
            if (!news) return res.notFound();

            async.each(news.comments, function (comment, callback) {
                User.findOne(comment.user).then(function (user) {
                    comment.user = user.toJSON();

                    return callback();
                }).catch(function (err) {
                    console.log(err);
                    return callback(err);
                });

            }, function (err) {
                if (err) return res.negotiate(err);

                return res.ok(UploadHelper.getFullUrl(req, news));
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Add comment for News
     * @param req
     * @param res
     */
    addComment: function (req, res) {
        var params = req.params.all();
        params.user = req.token.userId;

        News.findOne(req.params.id).then(function (news) {
            if (!news) return res.notFound('News with that ID not found');

            delete params.id;

            // Create comment and add it to news
            Comment.create(params).then(function (comment) {
                news.comments.add(comment);
                news.save(function (err, news) {
                    if (err) return res.negotiate(err);

                    User.fincOne(comment.user).then(function (user) {
                        comment.user = user;
                        return res.ok(comment);
                    }).catch(function (err) {
                        return res.negotiate(err);
                    });
                });
            })

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Like/unlike news
     * @param req
     * @param res
     */
    like: function (req, res) {
        Social.likeUnlike(req, 'news').then(function (news) {
            return res.ok(UploadHelper.getFullUrl(req, news));
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * List of news
     * @param req
     * @param res
     */
    list: function (req, res) {
        News.find().populate('file').then(function (news) {
            return res.ok(UploadHelper.getFullUrl(req, news));
        }).catch(function(err) {
            return res.negotiate(err);
        });
    }

};

