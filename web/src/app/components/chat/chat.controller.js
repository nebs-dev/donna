(function () {
    'use strict';

    angular
        .module('donna')
        .controller('ChatController', ChatController);

    /** @ngInject */
    function ChatController($scope, SweetAlert, LocalService, $state, API, Chat) {

        var vm = this;
        var token = angular.fromJson(LocalService.get('auth_token')).token;

        vm.messages = [];

        if (Chat.socket) {
            getData();
        } else {
            Chat.socket = io.connect(API.URL, {query: "__sails_io_sdk_version=0.11.0"});
        }

        Chat.socket.on('connect', function () {
            console.log("KONEKTO!");
            getData();
        });


        // eventi
        Chat.socket.on('disconnect', function () {
            console.log("UMIREM");
            vm.chatConnected = false;
            $scope.$apply();
        });

        Chat.socket.on('reconnect_error', function () {
            console.log("reconect error");
            vm.chatConnected = false;
            $scope.$apply();
        });

        Chat.socket.on('reconnect', function () {
            console.log("reconect");
            vm.chatConnected = true;
            $scope.$apply();
        });

        Chat.socket.on("message", function (data) {
            console.log("ide poruka");
            if (data.statusCode && data.statusCode != 200) return SweetAlert.swal('Chat error', data.body.summary);

            vm.messages.push(data.data);
            $scope.$apply();
        });


        //emiti
        vm.send = function (message) {
            Chat.socket.emit('post', {
                url: '/api/message/create',
                data: {token: token, text: message.text}
            }, function (data) {
                if (data.statusCode != 200) return SweetAlert.swal('Chat error', data.body.summary);
                $scope.$apply();
            });
        };


        function getData() {
            Chat.socket.emit("get", {url: "/api/message/connect", data: {token: token}}, function (data) {

                if (data.statusCode === 401 || data.statusCode === 403) {
                    Chat.socket.disconnect();
                    LocalService.unset('auth_token');
                    return $state.go('anon.login');
                }

                if (data.statusCode != 200) return alert("greska");

                vm.messages = data.body;
                vm.chatConnected = true;
                $scope.$apply();
            });
        }

    }

})();
