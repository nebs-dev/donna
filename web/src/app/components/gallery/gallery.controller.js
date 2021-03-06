(function () {
    'use strict';

    angular
        .module('donna')
        .controller('GalleryController', GalleryController);

    /** @ngInject */
    function GalleryController($scope, Gallery, SweetAlert, $state, Main, $sce) {
        var vm = this;

        vm.readyToUpload = true;
        var stateMethod = $state.current.method;

        // List
        if (stateMethod == 'list') {
            vm.galleries = [];

            Gallery.getGalleryList().success(function (data) {
                vm.galleries = data;
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        }

        // Update
        if (stateMethod == 'update') {
            Gallery.getOne($state.params.id).success(function (data) {
                vm.gallery = data;
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        }

        // Create
        if (stateMethod == 'create') {
            vm.gallery = {};
        }

        // Single
        if (stateMethod == 'single') {
            Gallery.getOne($state.params.id).success(function (data) {
                vm.gallery = data;
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        }


        vm.uploadFile = function () {
            vm.readyToUpload = false;
            Gallery.addFile($state.params.id, vm.gallery).success(function (data) {
                vm.gallery.files = data.files;
                vm.readyToUpload = true;
                //vm.gallery.fileToUpload = {};

                SweetAlert.swal({
                    title: 'Success',
                    text: 'File(s) successfully uploaded',
                    timer: 1000,
                    showConfirmButton: false,
                    type: 'success'
                });

            }).error(function (err) {
                vm.readyToUpload = true;
                SweetAlert.swal('Error', 'Upload failed', 'error');
            });
        };


        vm.save = function () {
            vm.readyToUpload = false;
            var action = (stateMethod == 'update') ? Gallery.update($state.params.id, vm.gallery) : Gallery.create(vm.gallery);

            action.success(function (gallery) {
                vm.readyToUpload = true;

                SweetAlert.swal({
                    title: 'Success',
                    text: 'Data successfully saved',
                    timer: 1000,
                    showConfirmButton: false,
                    type: 'success'
                });

                $state.go('user.galleries');

            }).error(function (err) {
                console.log(err);
                vm.readyToUpload = true;
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        };

        vm.destroy = function (id) {
            Gallery.destroyGallery(id).success(function () {
                vm.galleries = _.reject(vm.galleries, function (gallery) {
                    return id == gallery.id;
                });
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        };

        vm.deleteFile = function (id) {
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this file!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            }, function () {
                Gallery.destroyFile(id).success(function () {
                    vm.gallery.files = _.reject(vm.gallery.files, function (file) {
                        return id == file.id;
                    });

                    swal("Deleted!", "File has been deleted.", "success");

                }).error(function (err) {
                    SweetAlert.swal(err.error, err.summary, 'error');
                });
            });
        };


        // Get comments for each file
        vm.getComments = function (item) {
            if (item) {
                var html = '<div class="fb-comments"><ul>';

                _.each(item.comments, function (comment) {
                    var thumb;
                    var userCredential = '';

                    if (comment.user.email) {
                        userCredential = comment.user.email;
                    }

                    if (comment.user.file) {
                        thumb = comment.user.file.thumb;
                    } else if (comment.user.facebookId) {
                        thumb = 'https://graph.facebook.com//'+ message.user.facebookId +'/picture?width=1080&height=1080';
                    } else {
                        thumb = 'http://api.adorable.io/avatars/100/' + userCredential;
                    }

                    html += '<li class="komentar"><img src="'+ thumb +'">';
                    html += '<div class="comment-content"><span>'+userCredential+'</span><p>' + comment.text + '</p>';
                    html += '<button onclick="window.proxyDestroyComment(\''+comment.id+'\', \''+item.id+'\', this)" class="btn btn-sm btn-danger"><i class="fa fa-remove"></i></button></div></li>';
                });

                html += '</ul></div>';

                return html;
            }
        };


        // Destroy comment
        vm.destroyComment = function (id, itemId, komentar) {
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this message!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            }, function () {
                Main.destroyComment(id).success(function (data) {
                    // get item object
                    var item = _.findWhere(vm.gallery.files, {id: itemId});
                    item.commentsNum -= 1;

                    // remove comment from item by id
                    item.comments = _.reject(item.comments, function (comment) {
                        return id == comment.id;
                    });

                    // replace item in gallery with item without comment
                    _.extend(_.findWhere(vm.gallery.files, { id: item.id }), item);
                    komentar.remove();

                    swal("Deleted!", "Comment has been deleted.", "success");

                }).error(function (err) {
                    SweetAlert.swal(err.error, err.summary, 'error');
                });
            });
        };

        window.proxyDestroyComment = function(id, itemId, btn) {
            vm.destroyComment(id, itemId, jQuery(btn).parents('.komentar'));
        };

    }


})();
