(function () {
    'use strict';

    angular
        .module('donna')
        .factory('Gallery', Gallery);


    function Gallery($http, API) {
        return {
            getGalleryList: function () {
                return $http.get(API.URL + '/api/galleries');
            },

            getOne: function (id) {
                return $http.get(API.URL + '/api/gallery/show/' + id);
            },

            create: function (data) {
                return data.$http(API.URL + '/api/gallery/create');
            },

            update: function (id, data) {
                return data.$http(API.URL + '/api/gallery/update/' + id);
            },

            destroyGallery: function (id) {
                return $http.post(API.URL + '/api/gallery/destroy/' + id);
            },

            addFile: function (id, data) {
                return data.$http(API.URL + '/api/gallery/addFile/' + id);
            }
        }
    }

})();
