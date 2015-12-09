(function () {
    'use strict';

    angular
        .module('donna')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($rootScope, $state, Auth, SweetAlert) {
        var vm = this;

        vm.login = function (user) {
            Auth.login(user).success(function (data) {
                if (!data.user.role || data.user.role.name != 'superadmin') {
                    return SweetAlert.swal('Forbidden', 'You don\'t have permissions to access.');
                }

                $rootScope.globalUser = data.user;
                $state.go('user.dashboard');
            }).error(function (data) {
                SweetAlert.swal(data.error, data.summary);
            });
        };
    }
})();