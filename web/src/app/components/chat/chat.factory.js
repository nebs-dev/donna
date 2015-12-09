(function () {
    'use strict';

    angular
        .module('donna')
        .factory('Chat', Chat);


    function Chat(LocalService) {
        var socket = io.connect('http://52.16.220.86:667', {query: "__sails_io_sdk_version=0.11.0"});
        var token = angular.fromJson(LocalService.get('auth_token')).token;


        var chat = {
            messageBuffer: [],
            connect: function (cb) {
                return socket.on('connect', function () {
                    socket.emit("get", {url: "/api/message/connect", data: {token: token}}, function(data) {
                        //if(neka greska) retrun cb(err);
                        chat.messageBuffer = data.body;

                        return cb(null, data.body);
                    });
                });
            },

            onMsg: function(cb) {
                return socket.on("message", function(data) {
                    //if(neka greska) retrun cb(err);
                    chat.messageBuffer.push(data.data);
                    cb(null, data.data);
                });
            },

            sendMsg: function (message, cb) {
                return socket.emit('post', {
                    url: '/api/message/create',
                    data: {token: token, text: message.text}
                }, cb);
            }
        };

        return chat;
    }

})();
