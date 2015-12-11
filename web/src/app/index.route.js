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
            .state('user.newsUpdate', {
                url: '/news/update:id',
                templateUrl: 'app/components/news/news-form.html',
                controller: 'NewsController',
                controllerAs: 'newsCtrl',
                method: 'update'
            })
            .state('user.newsCreate', {
                url: '/news/create',
                templateUrl: 'app/components/news/news-form.html',
                controller: 'NewsController',
                controllerAs: 'newsCtrl',
                method: 'create'
            })
            .state('user.events', {
                url: '/events',
                templateUrl: 'app/components/event/events.html',
                controller: 'EventController',
                controllerAs: 'eventCtrl',
                method: 'list'
            })
            .state('user.eventUpdate', {
                url: '/event/update/:id',
                templateUrl: 'app/components/event/event-form.html',
                controller: 'EventController',
                controllerAs: 'eventCtrl',
                method: 'update'
            })
            .state('user.eventCreate', {
                url: '/event/create',
                templateUrl: 'app/components/event/event-form.html',
                controller: 'EventController',
                controllerAs: 'eventCtrl',
                method: 'create'
            })
            .state('user.users', {
                url: '/users',
                templateUrl: 'app/components/user/users.html',
                controller: 'UserController',
                controllerAs: 'userCtrl',
                method: 'list'
            })
            .state('user.userUpdate', {
                url: '/user/update/:id',
                templateUrl: 'app/components/user/user-form.html',
                controller: 'UserController',
                controllerAs: 'userCtrl',
                method: 'update'
            })
            .state('user.userCreate', {
                url: '/user/create',
                templateUrl: 'app/components/user/user-form.html',
                controller: 'UserController',
                controllerAs: 'userCtrl',
                method: 'create'
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
