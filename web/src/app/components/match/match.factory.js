(function () {
    'use strict';

    angular
        .module('donna')
        .factory('Match', Match);


    function Match ($http, API) {
        return {
            getMatches: function () {
                return $http.get(API.URL + '/api/matches');
            },

            destroy: function (id) {
                return $http.post(API.URL + '/api/match/destroy/' + id);
            },

            getOne: function (id) {
                return $http.get(API.URL + '/api/match/' + id);
            },

            create: function (data) {
                return $http.post(API.URL + '/api/match/create', data);
            },

            update: function (id, data) {
                return $http.post(API.URL + '/api/match/update/' + id, data);
            },

            newMessage: function (id, data) {
                data.matchId = id;
                return $http.post(API.URL + '/api/match/newMessage', data);
            },

            destroyMsg: function (id) {
                return $http.post(API.URL + '/api/match/destroyMsg/' + id);
            },

            connect: function (id) {
                return $http.get(API.URL + '/api/match/connect/' + id);
            }
        }
    }

})();
