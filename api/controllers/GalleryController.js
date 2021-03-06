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
        Gallery.findOne(req.params.id).populate('files', {sort: 'createdAt DESC'}).populate('comments').then(function (gallery) {
            if (!gallery) return res.notFound('Gallery not found');

            var usersIDs = _.pluck(gallery.comments, 'user');
            User.find(usersIDs).populate('file').then(function (users) {
                users = _.indexBy(users, 'id');

                _.each(gallery.comments, function (comment) {
                    comment.user = UploadHelper.getFullUrl(req, users[comment.user]);
                });


                async.map(gallery.files, function (file, callback) {
                    Media.findOne(file.id).populate('comments').then(function (mediaFile) {

                        // Populate user/his media for each comment
                        async.each(mediaFile.comments, function (comment, cb) {
                            User.findOne(comment.user).then(function (user) {
                                if (!user) return res.notFound('User not found');
                                if (!user.file) return cb();

                                Media.findOne(user.file).then(function (media) {
                                    if (!media) return res.notFound('Media not found');

                                    user.file = media;
                                    comment.user = UploadHelper.getFullUrl(req, user);
                                    return cb();
                                });
                            }).catch(function (err) {
                                return cb(err)
                            });

                        }, function (err) {
                            if (err) return res.negotiate(err);

                            callback(false, mediaFile.toJSON());
                        });

                    }).catch(function (err) {
                        console.log(err);
                        callback(err);
                    });

                }, function (err, data) {
                    if (err) return res.negotiate(err);

                    var galle = gallery.toJSON();
                    galle.files = LikeHelper.checkLike(req, data);

                    Media.findOne(galle.file).then(function (coverMedia) {
                        galle.file = coverMedia;
                        return res.ok(UploadHelper.getFullUrl(req, galle));
                    });
                });
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
        Gallery.find().sort('createdAt DESC').populateAll().then(function (galleries) {

            _.each(galleries, function (gallery) {
                var galleryPhotos = _.where(gallery.files, {type: 'photo'});
                var galleryVideos = _.where(gallery.files, {type: 'video'});
                gallery.photoNum = galleryPhotos.length;
                gallery.videoNum = galleryVideos.length;
            });

            return res.ok(LikeHelper.checkLike(req, UploadHelper.getFullUrl(req, galleries)));
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
            if (files) gallery.file = files[0].id;
            gallery.save(function (err, gallery) {
                if (err) return res.negotiate(err);
                return res.ok(LikeHelper.checkLike(req, UploadHelper.getFullUrl(req, gallery)));
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
        delete params.comments;

        Gallery.update(req.params.id, params).then(function (gallery) {

            return [gallery[0], UploadHelper.uploadFile(req, 'gallery')];

        }).spread(function (gallery, files) {
            if (files) {
                gallery.hasFiles = true;
                gallery.file = files[0].id;
            }

            gallery.save(function (err, gallery) {
                if (err) return res.negotiate(err);
                return res.ok(LikeHelper.checkLike(req, UploadHelper.getFullUrl(req, gallery)));
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
                return res.ok(LikeHelper.checkLike(req, UploadHelper.getFullUrl(req, gallery)));
            });

        }).catch(function (err) {
            console.log(err);
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

                    User.findOne(comment.user).populate('file').then(function (user) {
                        comment.user = UploadHelper.getFullUrl(req, user);
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
        Social.likeUnlike(req, 'gallery').then(function (gallery) {
            return res.ok(LikeHelper.checkLike(req, UploadHelper.getFullUrl(req, gallery)));
        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

