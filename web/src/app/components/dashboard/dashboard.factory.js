(function () {
    'use strict';

    angular
        .module('donna')
        .factory('Dashboard', Dashboard);


    function Dashboard ($http, API) {
        return {
            getData: function () {
                return $http.get(API.URL + '/api/general/dashboardData');
            }
        }
    }

})();
