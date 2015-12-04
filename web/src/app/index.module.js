(function () {
    'use strict';

    angular
        .module('donna', ['ngAnimate', 'ui.router', 'oitozero.ngSweetAlert'])

        .run(function ($rootScope, $state, Auth) {
            $rootScope.$on('$stateChangeStart', function (event, toState) {
                if (!Auth.authorize(toState.data.access)) {
                    event.preventDefault();

                    $state.go('anon.login');
                }
            });
        })
    ;

})();
