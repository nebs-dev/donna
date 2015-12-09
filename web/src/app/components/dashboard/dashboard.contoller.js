(function() {
    'use strict';

    angular
        .module('donna')
        .controller('DashboardController', DashboardController);

    /** @ngInject */
    function DashboardController(Dashboard, SweetAlert) {
        var vm = this;

        Dashboard.getData().success(function (data) {
            console.log(data);
            vm.data = data;
        }).error(function (data) {
            SweetAlert.swal(data.error, data.summary);
        });
    }

})();
