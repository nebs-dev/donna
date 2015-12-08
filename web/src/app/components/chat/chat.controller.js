(function () {
    'use strict';

    angular
        .module('donna')
        .controller('ChatController', ChatController);

    /** @ngInject */
    function ChatController($scope, Chat, SweetAlert) {
        var vm = this;
        vm.messages = [];

        Chat.connect(function (data) {
            vm.messages = data.body;
            $scope.$apply();

            Chat.onMsg(function (data) {
                console.log(data);
                vm.messages.push(data.data);
                $scope.$apply();
            });
        });

        vm.send = function (message) {
            Chat.sendMsg(message, function (data) {
                if (data.statusCode != 200) return SweetAlert.swal(data);

                vm.messages.push(data.body);
                $scope.$apply();
            });
        };
    }

})();
