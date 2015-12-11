(function() {
    'use strict';

    angular
        .module('donna')
        .controller('EventController', EventController);

    /** @ngInject */
    function EventController(Event, SweetAlert) {
        var vm = this;

        vm.news = [];

        Event.getEvents().success(function (data) {
            vm.events = data;
        }).error(function (err) {
            SweetAlert.swal(err.error, err.summary, 'error');
        });
    }

})();
