/**
 * GalleryController
 *
 * @description :: Server-side logic for managing galleries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * Show one gallery
     * @param req
     * @param res
     */
    show: function (req, res) {
        Gallery.findOne(req.params.id).populateAll().then(function (gallery) {
            if (!gallery) return res.notFound('Gallery not found');

            async.each(gallery.comments, function (comment, callback) {
                User.findOne(comment.user).then(function (user) {
                    comment.user = user.toJSON();

                    return callback();
                }).catch(function (err) {
                    console.log(err);
                    return callback(err);
                });

            }, function (err) {
                if (err) return res.negotiate(err);

                return res.ok(UploadHelper.getFullUrl(req, gallery));
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * List of galleries
     * @param req
     * @param res
     */
    list: function (req, res) {
        Gallery.find().populateAll().then(function (galleries) {
            return res.ok(UploadHelper.getFullUrl(req, galleries));
        }).catch(function (err) {
           return res.negotiate(err);
        });
    },

    /**
     * Create new gallery
     * @param req
     * @param res
     */
    create: function (req, res) {
        var params = req.params.all();

        Gallery.create(params).then(function (gallery) {

            return [gallery, UploadHelper.uploadFile(req, 'gallery')];

        }).spread(function (gallery, files) {
            if (files) gallery.cover = files[0].id;
            gallery.save(function (err, gallery) {
                if (err) return res.negotiate(err);
                return res.ok(UploadHelper.getFullUrl(req, gallery));
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Update gallery && upload cover file
     * @param req
     * @param res
     */
    update: function (req, res) {
        var params = req.params.all();
        delete params.file;

        Gallery.update(req.params.id, params).then(function (gallery) {

            return [gallery[0], UploadHelper.uploadFile(req, 'gallery')];

        }).spread(function (gallery, files) {
            if (files) {
                gallery.hasFiles = true;
                gallery.file = files[0].id;
            }

            gallery.save(function (err, gallery) {
                if (err) return res.negotiate(err);
                return res.ok(UploadHelper.getFullUrl(req, gallery));
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Destroy gallery
     * @param req
     * @param res
     */
    destroy: function (req, res) {
        Gallery.destroy(req.params.id).then(function () {
            return res.ok();
        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Add file to gallery
     * @param req
     * @param res
     */
    addFile: function (req, res) {
        Gallery.findOne(req.params.id).then(function (gallery) {
            if (!gallery) return res.notFound();

            return [gallery, UploadHelper.uploadFile(req, 'gallery')];

        }).spread(function (gallery, files) {

            gallery.files.add(files);
            gallery.save(function (err, gallery) {
                if (err) return res.negotiate(err);
                return res.ok(UploadHelper.getFullUrl(req, gallery));
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    },

    /**
     * Add comment to gallery
     * @param req
     * @param res
     */
    addComment: function (req, res) {
        var params = req.params.all();
        params.user = req.token.userId;

        Gallery.findOne(req.params.id).then(function (gallery) {
            if (!gallery) return res.notFound('Gallery with that ID not found');

            delete params.id;

            // Create comment and add it to file
            Comment.create(params).then(function (comment) {
                gallery.comments.add(comment);
                gallery.save(function (err, gallery) {
                    if (err) return res.negotiate(err);
                    return res.ok(comment);
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
        Social.likeUnlike(req, 'gallery').then(function (gallery) {
            return res.ok(UploadHelper.getFullUrl(req, gallery));
        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

