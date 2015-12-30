(function() {
    'use strict';

    angular
        .module('donna')
        .controller('MatchController', MatchController);

    /** @ngInject */
    function MatchController($state, Match, SweetAlert) {
        var vm = this;
        var stateMethod = $state.current.method;

        // List
        if (stateMethod == 'list') {
            vm.matches = [];

            Match.getMatches().success(function (data) {
                vm.matches = data;
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        }

        // Update
        if (stateMethod == 'update') {
            Match.getOne($state.params.id).success(function (data) {
                vm.match = data;
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        }

        // Create
        if (stateMethod == 'create') {
            vm.match = {};
        }

        // Single
        if (stateMethod == 'single') {
            Match.getOne($state.params.id).success(function (data) {

                Match.connect($state.params.id).success(function (match) {
                    vm.match = data;
                    vm.messages = data.messages;
                    vm.msg = {};
                });

            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        }


        vm.newMsg = function () {
            Match.newMessage($state.params.id, vm.msg).success(function (match) {
                vm.messages = match.messages;

                SweetAlert.swal({
                    title: 'Success',
                    text: 'Message successfully sent',
                    timer: 1000,
                    showConfirmButton: false,
                    type: 'success'
                });

            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        };

        vm.save = function () {
            var action = (stateMethod == 'update') ? Match.update($state.params.id, vm.match) : Match.create(vm.match);

            action.success(function (news) {
                SweetAlert.swal({
                    title: 'Success',
                    text: 'Data successfully saved',
                    timer: 1000,
                    showConfirmButton: false,
                    type: 'success'
                });

                $state.go('user.matches');

            }).error(function (err) {
                console.log(err);
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        };

        vm.destroy = function (id) {
            Match.destroy(id).success(function () {
                vm.matches = _.reject(vm.matches, function (match) {
                    return id == match.id;
                });

                SweetAlert.swal({
                    title: 'Success',
                    text: 'Data successfully deleted',
                    timer: 1000,
                    showConfirmButton: false,
                    type: 'success'
                });
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        };
    }

})();