(function () {
    'use strict';

    angular
        .module('donna')
        .controller('NavbarController', NavbarController);

    /** @ngInject */
    function NavbarController(Auth) {
        var vm = this;

        vm.logout = function () {
            Auth.logout();
        };
    }

})();
