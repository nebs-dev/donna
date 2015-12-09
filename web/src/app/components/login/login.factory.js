(function () {
    'use strict';

    angular
        .module('donna')
        .factory('LocalService', LocalService)
        .factory('Auth', Auth)
        .factory('AuthInterceptor', AuthInterceptor);

    /** @ngInject */
    function LocalService() {
        return {
            get: function (key) {
                return localStorage.getItem(key);
            },
            set: function (key, val) {
                return localStorage.setItem(key, val);
            },
            unset: function (key) {
                return localStorage.removeItem(key);
            }
        }
    }
    function Auth($http, LocalService, AccessLevels, API, $state, Chat) {
        return {
            authorize: function (access) {
                if (access === AccessLevels.user) {
                    return this.isAuthenticated();
                } else {
                    return true;
                }
            },
            isAuthenticated: function () {
                return LocalService.get('auth_token');
            },
            login: function (user) {
                var login = $http.post(API.URL + '/api/auth/login', user);
                login.success(function (result) {
                    LocalService.set('auth_token', angular.toJson(result));
                });
                return login;
            },
            logout: function () {
                // The backend doesn't care about logouts, delete the token and you're good to go.
                if(Chat.socket) Chat.socket.disconnect();
                LocalService.unset('auth_token');
                $state.go('anon.login');
            }
        }
    }

    function AuthInterceptor($q, $injector) {
        var LocalService = $injector.get('LocalService');

        return {
            request: function (config) {
                var token;
                if (LocalService.get('auth_token')) {
                    token = angular.fromJson(LocalService.get('auth_token')).token;
                }
                if (token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }
                return config;
            },
            responseError: function (response) {
                if (response.status === 401 || response.status === 403) {
                    LocalService.unset('auth_token');
                    $injector.get('$state').go('anon.login');
                }
                return $q.reject(response);
            }
        }
    }

})();
