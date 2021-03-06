(function () {
    'use strict';

    angular
        .module('donna', ['ngAnimate', 'ui.router', 'oitozero.ngSweetAlert', 'luegg.directives', 'btford.socket-io',
            'angularUtils.directives.dirPagination', 'akoenig.deckgrid', 'donnaFilters', 'angular-loading-bar'])

        .run(function ($rootScope, $state, Auth, LocalService) {
            var auth = angular.fromJson(LocalService.get('auth_token'));
            if (!$rootScope.globalUser && auth) {
                $rootScope.globalUser = auth.user;
            }

            $rootScope.$on('$stateChangeStart', function (event, toState) {
                if (!Auth.authorize(toState.data.access)) {
                    event.preventDefault();

                    $state.go('anon.login');
                }
            });
        });

})();
