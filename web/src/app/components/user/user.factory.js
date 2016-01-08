(function () {
    'use strict';

    angular
        .module('donna')
        .factory('User', User);


    function User ($http, API) {
        return {
            getOne: function (id) {
                return $http.get(API.URL + '/api/user/show/' + id);
            },

            getOneByToken: function (token) {
                return $http.get(API.URL + '/api/user/getByToken/' + token);
            },

            changePassword: function (id, data) {
                return $http.post(API.URL + '/api/user/reset/' + id, data);
            },

            getUsersList: function () {
                return $http.post(API.URL + '/api/users');
            },

            create: function (data) {
                return $http.post(API.URL + '/api/user/create', data);
            },

            update: function (id, data) {
                return data.$http(API.URL + '/api/user/update/' + id);
            },

            destroy: function (id) {
                return $http.post(API.URL + '/api/user/destroy/' + id);
            },

            getRoles: function () {
                return $http.get(API.URL + '/api/roles');
            }
        }
    }

})();
