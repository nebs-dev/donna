(function () {
    'use strict';

    angular
        .module('donna')
        .factory('Chat', Chat);


    function Chat(LocalService, API, $state) {

        var chat = {
            messageBuffer: [],
            socket: false,
            token: false,
            connect: function (cb) {
                if(!chat.socket) {

                    chat.socket = io.connect(API.URL, {query: "__sails_io_sdk_version=0.11.0"});
                    chat.token = angular.fromJson(LocalService.get('auth_token')).token;

                    chat.socket.on('connect', function () {
                        chat.socket.emit("get", {url: "/api/message/connect", data: {token: chat.token}}, function (data) {

                            if (data.statusCode === 401 || data.statusCode === 403) {
                                chat.socket.disconnect();
                                LocalService.unset('auth_token');
                                $state.go('anon.login');
                            }

                            if (data.statusCode != 200) return cb(data.body);
                            chat.messageBuffer = data.body;

                            return cb(null, data.body);
                        });
                    });


                    chat.socket.on('disconnect', function () {
                        chat.socket = false;
                    });

                }
            },

            reconnect_error: function(cb) {
                chat.socket.on('reconnect_error', cb);
            },

            reconnect: function(cb){
                chat.socket.on('reconnect', cb);
            },

            onMsg: function(cb) {
                return chat.socket.on("message", function(data) {
                     if(data.statusCode && data.statusCode != 200) return cb(data.body);

                    chat.messageBuffer.push(data.data);
                    cb(null, data.data);
                });
            },

            sendMsg: function (message, cb) {
                return chat.socket.emit('post', {
                    url: '/api/message/create',
                    data: {token: chat.token, text: message.text}
                }, cb);
            }
        };

        return chat;
    }

})();
