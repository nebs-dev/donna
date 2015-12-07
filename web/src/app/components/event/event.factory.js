(function () {
    'use strict';

    angular
        .module('donna')
        .factory('Event', Event);


    function Event ($http, API) {
        return {
            getEvents: function () {
                return $http.get(API.URL + '/api/events');
            }
        }
    }

})();
