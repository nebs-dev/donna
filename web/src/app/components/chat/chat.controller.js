(function () {
    'use strict';

    angular
        .module('donna')
        .controller('ChatController', ChatController);

    /** @ngInject */
    function ChatController(SweetAlert, LocalService, Chat, $rootScope) {
        var vm = this;

        var token = angular.fromJson(LocalService.get('auth_token')).token;

        Chat.emit("get", {url: "/api/message/connect", data: {token: token}}, function (data) {

            if (data.statusCode === 401 || data.statusCode === 403) {
                LocalService.unset('auth_token');
                $window.location.reload();
            }

            if (data.statusCode != 200) return SweetAlert.swal('Chat error', data.body.summary, 'error');

            $rootScope.messages = data.body.messages;
            $rootScope.totalChatUsers = data.body.total;
        });


        // Emit
        vm.send = function (message) {
            if (message && message.text) {
                Chat.emit('post', {
                    url: '/api/message/create',
                    data: {token: token, text: message.text}
                }, function (data) {
                    if (data.statusCode != 200) return SweetAlert.swal('Chat error', data.body.error, 'error');
                });
            }
        };

        vm.like = function (message) {
            Chat.emit('post', {
                url: '/api/message/like/' + message.id,
                data: {token: token}
            }, function (data) {
                if (data.statusCode != 200) return SweetAlert.swal('Chat error', data.body.error, 'error');
            });
        };

        vm.report = function (message) {
            Chat.emit('post', {
                url: '/api/message/report/' + message.id,
                data: {token: token}
            }, function (data) {
                if (data.statusCode != 200) return SweetAlert.swal('Chat error', data.body.error, 'error');
            });
        }

    }

})();
