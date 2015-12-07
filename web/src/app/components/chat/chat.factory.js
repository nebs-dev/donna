(function () {
    'use strict';

    angular
        .module('donna')
        .factory('Chat', Chat);


    function Chat (LocalService) {
        var socket = io.connect('http://localhost:1337', {query: "__sails_io_sdk_version=0.11.0"});
        var token = angular.fromJson(LocalService.get('auth_token')).token;

        return {
            sendMsg: function (message, cb) {
                return socket.emit('post', {
                    url: '/api/message/create',
                    data: {token: token, text: message.text}
                }, cb);
            }
        }
    }

})();
