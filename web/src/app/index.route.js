(function () {
    'use strict';

    angular
        .module('donna')
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider, AccessLevels) {
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
                templateUrl: 'app/components/login/login.html',
                controller: 'LoginController',
                controllerAs: 'loginCtrl'
            });

        $stateProvider
            .state('user', {
                abstract: true,
                templateUrl: 'app/main/main.html',
                controller: 'MainController',
                controllerAs: 'mainCtrl',
                data: {
                    access: AccessLevels.user
                }
            })
            .state('user.dashboard', {
                url: '/',
                templateUrl: 'app/components/dashboard/dashboard.html',
                controller: 'DashboardController',
                controllerAs: 'dashboardCtrl'
            })
            .state('user.news', {
                url: '/news',
                templateUrl: 'app/components/news/news.html',
                controller: 'NewsController',
                controllerAs: 'newsCtrl',
                method: 'list'
            })
            .state('user.newsEdit', {
                url: '/news/:id',
                templateUrl: 'app/components/news/news-form.html',
                controller: 'NewsController',
                controllerAs: 'newsCtrl',
                method: 'edit'
            })
            .state('user.events', {
                url: '/events',
                templateUrl: 'app/components/event/events.html',
                controller: 'EventController',
                controllerAs: 'eventCtrl'
            })
            .state('user.users', {
                url: '/users',
                templateUrl: 'app/components/user/users.html',
                controller: 'UserController',
                controllerAs: 'userCtrl',
                method: 'list'
            })
            .state('user.userEdit', {
                url: '/user/:id',
                templateUrl: 'app/components/user/user-form.html',
                controller: 'UserController',
                controllerAs: 'userCtrl',
                method: 'edit'
            })
            .state('user.chat', {
                url: '/chat',
                templateUrl: 'app/components/chat/chat.html',
                controller: 'ChatController',
                controllerAs: 'chatCtrl'
            })
        ;

        $urlRouterProvider.otherwise('/');
    }

})();
