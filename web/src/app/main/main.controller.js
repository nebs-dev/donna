(function () {
    'use strict';

    angular
        .module('donna')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController(Chat, $rootScope, SweetAlert, $state) {

        var vm = this;


        $rootScope.messages = [];
        vm.chatConnected = false;

        // eventi
        Chat.on('connect', function () {
            console.log("KONEKTO!");
            vm.chatConnected = true;
        });

        Chat.on('disconnect', function () {
            console.log("UMIREM");
            vm.chatConnected = false;
            SweetAlert.swal('Chat error', 'Lost connection!', 'error');
            return $state.go('user.dashboard');
        });

        Chat.on("message", function (data) {
            console.log("ide poruka");
            if (data.statusCode && data.statusCode != 200) return SweetAlert.swal('Chat error', data.body.summary, 'error');
            $rootScope.messages.push(data.data);
        });

    }
})();
