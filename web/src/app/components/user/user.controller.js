(function () {
    'use strict';

    angular
        .module('donna')
        .controller('UserController', UserController);

    /** @ngInject */
    function UserController($state, User, SweetAlert) {
        var vm = this;
        var stateMethod = $state.current.method;
        vm.stateMethod = $state.current.method;
        vm.readyToUpload = true;
        vm.roles = [];

        User.getRoles().success(function (roles) {
            vm.roles = roles;

            // Create
            if (stateMethod == 'create') {
                vm.user = {};
            }

            // Update
            if (stateMethod == 'update') {
                vm.user = {};

                User.getOne($state.params.id).success(function (data) {
                    vm.user = data;
                }).error(function (err) {
                    SweetAlert.swal(err.error, err.summary, 'error');
                });
            }

        }).error(function (err) {
            SweetAlert.swal(err.error, err.summary, 'error');
        });


        // List
        if (stateMethod == 'list') {
            vm.users = [];

            User.getUsersList().success(function (data) {
                vm.users = data;
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        }

        vm.save = function () {
            vm.readyToUpload = false;
            var action = (stateMethod == 'update') ? User.update($state.params.id, vm.user) : User.create(vm.user);

            action.success(function (user) {
                vm.readyToUpload = true;

                SweetAlert.swal({
                    title: 'Success',
                    text: 'Data successfully saved',
                    timer: 1000,
                    showConfirmButton: false,
                    type: 'success'
                });

                $state.go('user.users');

            }).error(function (err) {
                console.log(err);
                vm.readyToUpload = true;
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        };


        vm.destroy = function (id) {
            User.destroy(id).success(function () {
                vm.users = _.reject(vm.users, function (user) {
                    return id == user.id;
                });
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        }
    }

})();