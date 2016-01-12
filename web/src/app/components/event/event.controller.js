(function() {
    'use strict';

    angular
        .module('donna')
        .controller('EventController', EventController);

    /** @ngInject */
    function EventController($state, Event, SweetAlert) {
        var vm = this;
        var stateMethod = $state.current.method;
        vm.readyToUpload = true;

        if (stateMethod == 'list') {
            vm.events = [];

            Event.getEvents().success(function (data) {
                vm.events = data;
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        }

        if (stateMethod == 'update') {
            vm.event = {};

            Event.getOne($state.params.id).success(function (data) {
                data.date = moment(data.date).utc().format("YYYY-MM-DD HH:mm");
                vm.event = data;
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        }

        if (stateMethod == 'create') {
            vm.event = {};
        }


        vm.save = function () {
            vm.readyToUpload = false;
            var action = (stateMethod == 'update') ? Event.update($state.params.id, vm.event) : Event.create(vm.event);

            action.success(function (event) {
                vm.readyToUpload = true;

                SweetAlert.swal({
                    title: 'Success',
                    text: 'Data successfully saved',
                    timer: 1000,
                    showConfirmButton: false,
                    type: 'success'
                });

                $state.go('user.events');

            }).error(function (err) {
                console.log(err);
                vm.readyToUpload = true;
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        };

        vm.destroy = function (id) {
            Event.destroy(id).success(function () {
                vm.events = _.reject(vm.events, function (events) {
                    return id == events.id;
                });
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        };
    }

})();
