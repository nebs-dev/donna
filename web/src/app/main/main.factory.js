(function () {
    'use strict';

    angular
        .module('donna')
        .factory('Main', Main);


    function Main ($http, API) {
        return {
            destroyComment: function (id) {
                return $http.post(API.URL + '/api/comment/destroy/' + id);
            }
        }
    }

})();
