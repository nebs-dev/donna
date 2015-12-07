(function() {
    'use strict';

    angular
        .module('donna')
        .controller('UserController', UserController);

    /** @ngInject */
    function UserController(User, SweetAlert) {
        var vm = this;

        vm.users = [];

        User.getUsersList().success(function (data) {
            vm.users = data;
        }).error(function (err) {
            SweetAlert.swal(err.error, err.summary);
        });
    }

})();