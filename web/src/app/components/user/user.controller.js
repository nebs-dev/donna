(function() {
    'use strict';

    angular
        .module('donna')
        .controller('UserController', UserController);

    /** @ngInject */
    function UserController($state, User, SweetAlert) {
        var vm = this;
        var stateMethod = $state.current.method;

        // List
        if (stateMethod == 'list') {
            vm.users = [];

            User.getUsersList().success(function (data) {
                vm.users = data;
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        }

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

        vm.save = function () {
            var action = (stateMethod == 'update') ? User.update($state.params.id, vm.user) : User.create(vm.user);

            action.success(function (user) {
                SweetAlert.swal({
                    title: 'Success',
                    text: 'Data successfully saved',
                    timer: 1000,
                    showConfirmButton: false,
                    type: 'success'
                });

                $state.go('user.users');

            }).error(function (err) {
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