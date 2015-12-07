(function () {
    'use strict';

    angular
        .module('donna')
        .factory('News', News);


    function News ($http, API) {
        return {
            getNewsList: function () {
                return $http.post(API.URL + '/api/news');
            },

            destroyNews: function (id) {
                return $http.post(API.URL + '/api/news/destroy/' + id);
            }
        }
    }

})();
