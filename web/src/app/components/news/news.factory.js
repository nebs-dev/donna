(function () {
    'use strict';

    angular
        .module('donna')
        .factory('News', News);


    function News($http, API) {
        return {
            getNewsList: function () {
                return $http.get(API.URL + '/api/news');
            },

            destroyNews: function (id) {
                return $http.post(API.URL + '/api/news/destroy/' + id);
            },

            getOne: function (id) {
                return $http.get(API.URL + '/api/news/show/' + id);
            },

            create: function (data) {
                return data.$http(API.URL + '/api/news/create');
            },

            update: function (id, data) {
                return data.$http(API.URL + '/api/news/update/' + id);
            }
        }
    }

})();
