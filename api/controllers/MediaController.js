/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * Get one single file object
     * @param req
     * @param res
     */
    show: function (req, res) {
        Media.findOne(req.params.id).populateAll().then(function (media) {
            if (!media) return res.notFound('File not found');

            async.each(media.comments, function (comment, callback) {
                User.findOne(comment.user).then(function (user) {
                    comment.user = user.toJSON();

                    return callback();
                }).catch(function (err) {
                    return callback(err);
                });

            }, function (err) {
                if (err) return res.negotiate(err);

                return res.ok(LikeHelper.checkLike(req, UploadHelper.getFullUrl(req, media)));
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Get one file
     * @param req
     * @param res
     */
    getOne: function (req, res) {
        req.validate({
            id: 'string'
        });

        Media.findOne(req.params.id).exec(function (err, file){
            if (err) return res.negotiate(err);
            if (!file) return res.notFound();

            // File object has no file uploaded
            // (should have never have hit this endpoint)
            if (!file.url) {
                return res.notFound();
            }

            var SkipperDisk = require('skipper-disk');
            var fileAdapter = SkipperDisk(/* optional opts */);

            if (file.type = 'video') {
                res.setHeader("Content-Type", "video/mp4");
            }

            // Stream the file down
            fileAdapter.read('uploads/' + file.url)
                .on('error', function (err){
                    return res.serverError(err);
                })
                .pipe(res);
        });
    },

    getOnePublic: function (req, res) {
        req.validate({
            id: 'string'
        });

        Media.findOne(req.params.id).exec(function (err, file){
            if (err) return res.negotiate(err);
            if (!file) return res.notFound();

            // File object has no file uploaded
            // (should have never have hit this endpoint)
            if (!file.url) {
                return res.notFound();
            }

            var SkipperDisk = require('skipper-disk');
            var fileAdapter = SkipperDisk(/* optional opts */);

            // Stream the file down
            fileAdapter.read('uploads/' + file.url)
                .on('error', function (err){
                    return res.serverError(err);
                })
                .pipe(res);
        });
    },

    getThumbPublic: function (req, res) {
        req.validate({
            id: 'string'
        });

        Media.findOne(req.params.id).exec(function (err, file){
            if (err) return res.negotiate(err);
            if (!file) return res.notFound();

            // File object has no file uploaded
            // (should have never have hit this endpoint)
            if (!file.url) {
                return res.notFound();
            }

            var SkipperDisk = require('skipper-disk');
            var fileAdapter = SkipperDisk(/* optional opts */);

            // Stream the file down
            fileAdapter.read('uploads/' + file.thumb)
                .on('error', function (err){
                    return res.serverError(err);
                })
                .pipe(res);
        });
    },

    /**
     * Get one file
     * @param req
     * @param res
     */
    getThumb: function (req, res) {
        req.validate({
            id: 'string'
        });

        Media.findOne(req.params.id).exec(function (err, file){
            if (err) return res.negotiate(err);
            if (!file) return res.notFound();

            // File object has no file uploaded
            // (should have never have hit this endpoint)
            if (!file.thumb) {
                return res.notFound();
            }

            var SkipperDisk = require('skipper-disk');
            var fileAdapter = SkipperDisk(/* optional opts */);

            // Stream the file down
            fileAdapter.read('uploads/' + file.thumb)
                .on('error', function (err){
                    return res.serverError(err);
                })
                .pipe(res);
        });
    },

    /**
     * Destroy File
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        Media.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Add comment to file
     * @param req
     * @param res
     */
    addComment: function (req, res) {
        var params = req.params.all();
        params.user = req.token.userId;

        Media.findOne(req.params.id).then(function (file) {
            if (!file) return res.notFound('File with that ID not found');

            delete params.id;

            // Create comment and add it to file
            Comment.create(params).then(function (comment) {
                file.comments.add(comment);
                file.save(function (err, file) {
                    if (err) return res.negotiate(err);

                    User.findOne(comment.user).then(function (user) {
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
     * Like/unlike file
     * @param req
     * @param res
     */
    like: function (req, res) {
        Social.likeUnlike(req, 'media').then(function (file) {
            return res.ok(LikeHelper.checkLike(req, UploadHelper.getFullUrl(req, file)));
        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

