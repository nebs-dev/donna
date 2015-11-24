var path = require('path');
module.exports = {

    uploadFile: function (req, model, item) {
        return new Promise(function (resolve, reject) {

            req.file('file').upload({
                // don't allow the total upload size to exceed ~10MB
                maxBytes: 10000000,
                dirname: sails.config.appPath + '/uploads/' + model + '/'

            }, function whenDone(err, uploadedFiles) {
                if (err) return reject(err);

                // If no files were uploaded, respond with an error.
                if (uploadedFiles.length === 0) return resolve(item);

                item.file = path.basename(uploadedFiles[0].fd);

                item.save(function (err, item) {
                    if (err) return reject(err);

                    return resolve(item);
                });
            });

        });
    }

};