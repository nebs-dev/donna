(function() {
    'use strict';

    angular
        .module('donna')
        .controller('SidebarController', SidebarController);

    /** @ngInject */
    function SidebarController($location, Auth) {
        var vm = this;

        vm.isActive = function (route) {
            return route == $location.$$path;
        };
    }

})();
