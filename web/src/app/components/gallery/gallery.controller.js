(function () {
    'use strict';

    angular
        .module('donna')
        .controller('GalleryController', GalleryController);

    /** @ngInject */
    function GalleryController($scope, Gallery, SweetAlert, $state) {
        var vm = this;
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
            Gallery.addFile($state.params.id, vm.gallery).success(function (data) {
                vm.gallery.files = data.files;

                SweetAlert.swal({
                    title: 'Success',
                    text: 'File(s) successfully uploaded',
                    timer: 1000,
                    showConfirmButton: false,
                    type: 'success'
                });

            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        };


        vm.save = function () {
            var action = (stateMethod == 'update') ? Gallery.update($state.params.id, vm.gallery) : Gallery.create(vm.gallery);

            action.success(function (gallery) {
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

        vm.destroyFile = function (id) {
            return '<h1>TEST</h1>';
            alert('TEST');
        }

    }


})();
