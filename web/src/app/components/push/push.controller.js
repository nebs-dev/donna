(function () {
    'use strict';

    angular
        .module('donna')
        .controller('PushController', PushController);

    /** @ngInject */
    function PushController(Push, SweetAlert) {
        var vm = this;
        vm.text = '';

        vm.send = function () {
            Push.send(vm.text).success(function (data) {
                console.log(data);
                vm.text = '';
                SweetAlert.swal({
                    title: 'Success',
                    text: 'Pushes successfully sent',
                    timer: 2000,
                    showConfirmButton: false,
                    type: 'success'
                });
            }).error(function (err) {
                SweetAlert.swal(err.error, err.summary, 'error');
            });
        }
    }


})();
