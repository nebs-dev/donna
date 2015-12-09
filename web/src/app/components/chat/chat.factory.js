(function () {
    'use strict';

    angular
        .module('donna')
        .factory('Chat', Chat);


    function Chat(LocalService, API, $state) {
        return {
            socket: false,
            events: false
        };

    }

})();
