(function () {
    'use strict';

    angular
        .module('donna')
        .controller('AnonController', AnonController);

    /** @ngInject */
    function AnonController($state, User, SweetAlert, LocalService) {
        var vm = this;
        var stateMethod = $state.current.method;
        vm.user = {};

        // resetPassword
        if (stateMethod == 'resetPassword') {
            User.getOneByToken($state.params.token).success(function (data) {
                vm.user = data;
                var auth_token = {
                    token: $state.params.token,
                    user: data
                };

                LocalService.set('auth_token', angular.toJson(auth_token));

            }).error(function (err) {
               console.log(err);
            });
        }

        // Activate user
        if (stateMethod == 'activateUser') {
            User.activateUser($state.params.token).success(function (data) {
                SweetAlert.swal({
                    title: 'Success',
                    text: 'User '+data.firstName+ ' '+data.lastName+' successfully activated',
                    timer: 3500,
                    showConfirmButton: false,
                    type: 'success'
                });

                $state.go('anon.login');

            }).error(function (err) {
                console.log('Error: ', err);
                SweetAlert.swal(err.error, err.status, 'error');
            });
        }

        // save new password data
        vm.save = function () {
            User.changePassword(vm.user.id, vm.user).success(function (user) {
                SweetAlert.swal({
                    title: 'Success',
                    text: 'Data successfully saved',
                    timer: 1000,
                    showConfirmButton: false,
                    type: 'success'
                });

                // Unset temp token
                LocalService.unset('auth_token');
                $state.go('anon.login');

            }).error(function (err) {
                console.log(err);
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        };
    }

})();