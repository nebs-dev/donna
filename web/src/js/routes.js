'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider', 'AccessLevels',
    function($stateProvider, $urlRouterProvider, AccessLevels) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('anon', {
                abstract: true,
                template: '<ui-view/>',
                data: {
                    access: AccessLevels.anon
                }
            })
            .state('anon.login', {
                url: '/login',
                templateUrl: 'templates/login.html'
            })
            .state('anon.register', {
                url: '/register',
                templateUrl: 'templates/register.html'
            });

        $stateProvider
            .state('user', {
                abstract: true,
                template: '<ui-view/>',
                data: {
                    access: AccessLevels.user
                }
            })
            .state('user.index', {
                url: '/',
                templateUrl: 'templates/dashboard.html'
            })
            .state('user.show', {
                url: '/tables',
                templateUrl: 'templates/tables.html'
            });

        //$stateProvider
        //    .state('index', {
        //        url: '/',
        //        templateUrl: 'templates/dashboard.html'
        //    })
        //    .state('tables', {
        //        url: '/tables',
        //        templateUrl: 'templates/tables.html'
        //    });
    }
]);