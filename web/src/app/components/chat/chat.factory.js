(function () {
    'use strict';

    angular
        .module('donna')
        .factory('Chat', Chat);


    function Chat(API, socketFactory, LocalService) {
        console.log("ide factory");
        var ioSocket = io.connect(API.URL, {query: "__sails_io_sdk_version=0.11.0&user=" + JSON.parse(LocalService.get('auth_token')).user.id});

        return socketFactory({
            ioSocket: ioSocket
        });

    }

})();
