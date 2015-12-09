(function () {
    'use strict';

    angular
        .module('donna')
        .controller('ChatController', ChatController);

    /** @ngInject */
    function ChatController($scope, Chat, SweetAlert) {
        var vm = this;

        vm.messages = Chat.messageBuffer || [];

        Chat.connect(function (err, data) {
            if (err) return SweetAlert.swal(err);

            vm.messages = data;
            $scope.$apply();

            Chat.onMsg(function (err, data) {
                vm.messages.push(data);
                $scope.$apply();
            });
        });

        vm.send = function (message) {
            Chat.sendMsg(message, function (data) {
                if (data.statusCode != 200) return SweetAlert.swal(data);
            });
        };
    }

})();
