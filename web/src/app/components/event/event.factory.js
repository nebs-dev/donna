(function () {
    'use strict';

    angular
        .module('donna')
        .factory('Event', Event);


    function Event ($http, API) {
        return {
            getEvents: function () {
                return $http.get(API.URL + '/api/events');
            },

            destroy: function (id) {
                return $http.post(API.URL + '/api/event/destroy/' + id);
            },

            getOne: function (id) {
                return $http.get(API.URL + '/api/event/show/' + id);
            },

            create: function (data) {
                return data.$http(API.URL + '/api/event/create');
            },

            update: function (id, data) {
                return data.$http(API.URL + '/api/event/update/' + id);
            }
        }
    }

})();
