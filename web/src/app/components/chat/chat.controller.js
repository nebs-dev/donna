(function() {
    'use strict';

    angular
        .module('donna')
        .controller('ChatController', ChatController);

    /** @ngInject */
    function ChatController($scope, Chat, SweetAlert, LocalService) {
        var vm = this;
        vm.messages = [];

        var socket = io.connect('http://localhost:1337', {query: "__sails_io_sdk_version=0.11.0"});

        socket.on('connect', function () {
            var token = angular.fromJson(LocalService.get('auth_token')).token;
            console.log(token);
            socket.emit("get", {url: "/api/message/connect", data: {token: token}}, function (data) {
                console.log(data);
                vm.messages = data.body;
                $scope.$apply();
            });

            // message je ime modela...
            //socket.on("message", function (data) {
            //    console.log(data);
            //    vm.messages.push(data.data);
            //    $scope.$apply();
            //});
        });

        vm.send = function (message) {
            Chat.sendMsg(message, function (data) {
                if(data.statusCode != 200) return SweetAlert.swal(data.error, data.summary);
                vm.messages.push(data.body);
                $scope.$apply();
                console.log(data.body);
            });
        };
    }

})();
