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
                console.log(data);

                return $http({
                    url: API.URL + '/api/news/create',
                    method: "POST",
                    data: API.formData(data),
                    headers: {'Content-Type': undefined}
                });
            },

            update: function (id, data) {
                return $http.post(API.URL + '/api/news/update/' + id, data);
            }
        }
    }

})();
