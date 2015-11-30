var path = require('path');
module.exports = {

    uploadFile: function (req, model) {
        return new Promise(function (resolve, reject) {

            req.file('file').upload({
                // don't allow the total upload size to exceed ~10MB
                maxBytes: 10000000,
                dirname: sails.config.appPath + '/uploads/' + model + '/'

            }, function whenDone(err, uploadedFiles) {
                if (err) return reject(err);

                // If no files were uploaded, respond with an error.
                if (uploadedFiles.length === 0) return reject();

                var file = {
                    'url': model + '/' + path.basename(uploadedFiles[0].fd)
                };

                File.create(file).then(function (file) {
                    return resolve(file);
                }).catch(function (err) {
                    return resolve(err);
                });
            });

        });
    },

    getFullUrl: function(model, fileName) {
        var baseURL = sails.getBaseurl();
        console.log(baseURL);

        return baseURL + 'file/getOne/' + fileName;
    }

};