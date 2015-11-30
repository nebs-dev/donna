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
        Gallery.findOne(req.params.id).populate('files').then(function (gallery) {


            return res.json(UploadHelper.getFullUrl(req, gallery));
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

            gallery.files.add(files);
            gallery.save(function (err, gallery) {
                if (err) return res.negotiate(err);
                return res.json(gallery);
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
                return res.json(gallery);
            });

        }).catch(function (err) {
            return res.negotiate(err);
        });
    }

};

