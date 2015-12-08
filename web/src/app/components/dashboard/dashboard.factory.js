(function () {
    'use strict';

    angular
        .module('donna')
        .factory('Dashboard', Dashboard);


    function Dashboard ($http, API) {
        return {
            getData: function () {
                delete $http.defaults.headers.common['X-Requested-With'];
                return $http.get(API.URL + '/api/general/dashboardData');
            }
        }
    }

})();
