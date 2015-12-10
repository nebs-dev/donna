var path = require('path');
module.exports = {

    uploadFile: function (req, model) {
        return new Promise(function (resolve, reject) {
            req.file('fileToUpload').upload({
                // don't allow the total upload size to exceed ~10MB
                maxBytes: 10000000,
                dirname: sails.config.appPath + '/uploads/' + model + '/'

            }, function whenDone(err, uploadedFiles) {
                if (err) return reject(err);

                // If no files were uploaded, respond with an error.
                if (uploadedFiles.length === 0) return resolve();

                var newFiles = [];
                async.filter(uploadedFiles, function (file, cb) {
                    var fileDb = {
                        'url': model + '/' + path.basename(file.fd)
                    };

                    Media.create(fileDb).then(function (f) {
                        newFiles.push(f);
                        return cb(true);
                    }).catch(function (err) {
                        fs.remove(file.fd, function (err) {
                            if (err) return res.negotiate(err);

                            return cb(false);
                        });
                    });

                }, function (results) {
                    return resolve(newFiles);
                });

            });

        });
    },

    getFullUrl: function(req, data) {
        var baseURL = sails.getBaseurl();

        if(data.length) {
            _.each(data, function (item) {
                if (item.file) {
                    item.file.url = baseURL + '/api/file/' + item.file.id + '?token=' + req.originalToken;
                }
            });
        } else {
            if (data.file) {
                data.file.url = baseURL + '/api/file/' + data.file.id + '?token=' + req.originalToken;
            }
        }



        return data;
    }

};