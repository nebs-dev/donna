(function () {
    'use strict';

    angular
        .module('donna')
        .controller('ChatController', ChatController);

    /** @ngInject */
    function ChatController($scope, Chat, SweetAlert) {
        var vm = this;

        vm.messages = Chat.messageBuffer || [];
        vm.chatConnected = Chat.connected || false;


        Chat.connect(function (err, data) {
            if(!err && !data) return;
            if (err) return SweetAlert.swal('Chat Error', err.summary);

            vm.chatConnected = true;

            vm.messages = data;
            $scope.$apply();

            Chat.onMsg(function (err, data) {
                if (err) return SweetAlert.swal('Chat error', err.summary);
                $scope.$apply();
            });

            Chat.reconnect_error(function() {
               vm.chatConnected = false;
                $scope.$apply();
            });

            Chat.reconnect(function() {
                vm.chatConnected = true;
                $scope.$apply();
            });
        });

        vm.send = function (message) {
            Chat.sendMsg(message, function (data) {
                $scope.$apply();
                if (data.statusCode != 200) return SweetAlert.swal('Chat error', data.body.summary);
            });
        };
    }

})();
