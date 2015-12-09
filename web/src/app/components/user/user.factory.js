(function () {
    'use strict';

    angular
        .module('donna')
        .factory('User', User);


    function User ($http, API) {
        return {
            getUsersList: function () {
                return $http.post(API.URL + '/api/users');
            },

            destroyUser: function (id) {
                return $http.post(API.URL + '/api/user/destroy/' + id);
            }
        }
    }

})();
