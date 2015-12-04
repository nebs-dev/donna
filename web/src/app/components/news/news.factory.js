(function () {
    'use strict';

    angular
        .module('donna')
        .factory('News', News);


    function News ($http, API) {
        return {
            getNews: function () {
                return $http.post(API.URL + '/api/news');
            }
        }
    }

})();
