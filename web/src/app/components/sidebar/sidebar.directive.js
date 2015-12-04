(function() {
    'use strict';

    angular
        .module('donna')
        .directive('sidebar', sidebar);

    /** @ngInject */
    function sidebar() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/sidebar/sidebar.html',
            controller: 'SidebarController',
            controllerAs: 'sidebarCtrl',
            bindToController: true
        };

        return directive;
    }

})();
