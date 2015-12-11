(function() {
    'use strict';

    angular
        .module('donna')
        .controller('UserController', UserController);

    /** @ngInject */
    function UserController($state, User, SweetAlert) {
        var vm = this;

        if ($state.current.method == 'list') {
            vm.users = [];

            User.getUsersList().success(function (data) {
                vm.users = data;
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary);
            });
        }

        if ($state.current.method == 'edit') {
            vm.user = {};

            User.getOne($state.params.id).success(function (data) {
                vm.user = data;
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary);
            });
        }

        vm.destroy = function (id) {
            User.destroyUser(id).success(function () {
                vm.users = _.reject(vm.users, function (user) {
                    return id == user.id;
                });
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary);
            });
        }
    }

})();