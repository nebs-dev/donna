(function () {
    'use strict';

    angular
        .module('donna')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController(toState, Auth) {
        console.log(Auth.authorize(toState.data.access));
    }
})();
