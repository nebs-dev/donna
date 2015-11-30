/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    /**
     * Get one file
     * @param req
     * @param res
     */
    getOne: function (req, res) {
        req.validate({
            id: 'string'
        });

        File.findOne(req.param('id')).exec(function (err, file){
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
    }

};

