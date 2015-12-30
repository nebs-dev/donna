var path = require('path');
var fs = require('fs-extra');
var easyimg = require('easyimage');
module.exports = {

    uploadFile: function (req, model) {
        return new Promise(function (resolve, reject) {
            req.file('fileToUpload').upload({
                // don't allow the total upload size to exceed ~10MB
                maxBytes: 10000000,
                dirname: sails.config.appPath + '/uploads/' + model + '/'

            }, function whenDone(err, uploadedFiles) {
                if (err) return reject(err);

                // setting allowed file types
                var allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];

                // If no files were uploaded, respond with an error.
                if (uploadedFiles.length === 0) return resolve();

                var newFiles = [];

                async.filter(uploadedFiles, function (file, cb) {

                    // Check allowed file types
                    //if(allowedTypes.indexOf(file.type) !== -1) {
                    var mediaType = file.type == 'video/mp4' ? 'video' : 'photo';

                    if (mediaType == 'photo') {
                        easyimg.thumbnail({
                            src: sails.config.appPath + '/uploads/' + model + '/' + path.basename(file.fd),
                            dst: sails.config.appPath + '/uploads/' + model + '/thumb/' + path.basename(file.fd),
                            width:100, height:100
                        }).then(function(image) {
                            var fileDb = {
                                'url': model + '/' + path.basename(file.fd),
                                'type': mediaType,
                                'thumb': model + '/thumb/' + path.basename(file.fd)
                            };

                            Media.create(fileDb).then(function (f) {
                                newFiles.push(f);
                                return cb(true);
                            }).catch(function (err) {
                                console.log(err);

                                fs.remove(file.fd, function (err) {
                                    if (err) return reject(err);

                                    return cb(false);
                                });
                            });
                        }).catch(function (err) {
                            console.log(err);
                        });
                    } else {
                        var fileDb = {
                            'url': model + '/' + path.basename(file.fd),
                            'type': mediaType,
                            'thumb': 'video.png'
                        };

                        Media.create(fileDb).then(function (f) {
                            newFiles.push(f);
                            return cb(true);
                        }).catch(function (err) {
                            console.log(err);

                            fs.remove(file.fd, function (err) {
                                if (err) return reject(err);

                                return cb(false);
                            });
                        });
                    }


                    //}

                }, function (results) {
                    return resolve(newFiles);
                });

            });

        });
    },

    /**
     * TODO: refactor this !!!!
     * @param req
     * @param data
     * @returns {*}
     */
    getFullUrl: function (req, data) {
        var baseURL = sails.getBaseurl();

        if (data.length) {
            _.each(data, function (item) {
                if (item.file) {
                    item.file.url = baseURL + '/api/file/' + item.file.id + '?token=' + req.originalToken;
                    item.file.thumb = baseURL + '/api/file/thumb/' + item.file.id + '?token=' + req.originalToken;
                }
                if (item.files) {
                    _.each(item.files, function (file) {
                        file.url = baseURL + '/api/file/' + file.id + '?token=' + req.originalToken;
                        file.thumb = baseURL + '/api/file/thumb/' + file.id + '?token=' + req.originalToken;
                    });
                }
                if (item.user) {
                    item.user.file.url = baseURL + '/api/file/public/' + item.user.file.id;
                    item.user.file.thumb = baseURL + '/api/file/thumb/public/' + item.user.file.id;
                }
            });
        } else {
            if (data.url) {
                console.log(data);
                data.url = baseURL + '/api/file/' + data.id + '?token=' + req.originalToken;
                data.thumb = baseURL + '/api/file/thumb/' + data.id + '?token=' + req.originalToken;
            }
            if (data.file) {
                // If user public photos
                if (data.email) {
                    data.file.url = baseURL + '/api/file/public/' + data.file.id;
                    data.file.thumb = baseURL + '/api/file/thumb/public/' + data.file.id;
                } else {
                    data.file.url = baseURL + '/api/file/' + data.file.id + '?token=' + req.originalToken;
                    data.file.thumb = baseURL + '/api/file/thumb/' + data.file.id + '?token=' + req.originalToken;
                }
            }
            if (data.user) {
                data.user.file.url = baseURL + '/api/file/public/' + data.user.file.id;
                data.user.file.thumb = baseURL + '/api/file/thumb/public/' + data.user.file.id;
            }
            if (data.files) {
                _.each(data.files, function (file) {
                    file.url = baseURL + '/api/file/' + file.id + '?token=' + req.originalToken;
                    file.thumb = baseURL + '/api/file/thumb/' + file.id + '?token=' + req.originalToken;
                });
            }
        }

        return data;
    }

};