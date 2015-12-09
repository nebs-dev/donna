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
            connected: false,
            connect: function (cb) {
                if(chat.socket) return cb();

                    chat.socket = io.connect(API.URL, {query: "__sails_io_sdk_version=0.11.0"});
                    chat.token = angular.fromJson(LocalService.get('auth_token')).token;
                    chat.connected = true;

                console.log("KLONEKTAM");
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
                        console.log("UMIREM")
                        chat.connected = false;
                    });


            },

            reconnect_error: function(cb) {
                chat.socket.on('reconnect_error', cb);
                chat.connected = false;
            },

            reconnect: function(cb){
                chat.socket.on('reconnect', cb);
                chat.connected = true;
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
