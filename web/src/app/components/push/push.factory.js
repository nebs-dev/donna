(function () {
    'use strict';

    angular
        .module('donna')
        .factory('Push', Push);


    function Push($http, API) {
        return {
            send: function (text) {
                return $http.post(API.URL + '/api/push/send', {text: text});
            }
        }
    }

})();
