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

            getUsersList: function () {
                return $http.post(API.URL + '/api/users');
            },

            create: function (data) {
                return $http.post(API.URL + '/api/user/create', data);
            },

            update: function (id, data) {
                return $http.post(API.URL + '/api/user/update/' + id, data);
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
