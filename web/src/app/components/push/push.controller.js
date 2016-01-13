(function () {
    'use strict';

    angular
        .module('donna')
        .controller('PushController', PushController);

    /** @ngInject */
    function PushController(Push, SweetAlert) {
        var vm = this;
        vm.text = '';
        vm.readyToUpload = true;

        vm.send = function () {
            vm.readyToUpload = false;
            Push.send(vm.text).success(function (data) {
                vm.readyToUpload = true;
                vm.text = '';
                SweetAlert.swal({
                    title: 'Success',
                    text: 'Pushes successfully sent',
                    timer: 2000,
                    showConfirmButton: false,
                    type: 'success'
                });
            }).error(function (err) {
                vm.readyToUpload = true;
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        }
    }


})();
