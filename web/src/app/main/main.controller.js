(function () {
    'use strict';

    angular
        .module('donna')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController(Chat, $rootScope, SweetAlert, $state) {
        var vm = this;

        $rootScope.messages = [];
        vm.chatConnected = false;

        // Events
        Chat.on('connect', function () {
            console.log("KONEKTO!");
            vm.chatConnected = true;
        });

        Chat.on('disconnect', function () {
            console.log("UMIREM");

            vm.chatConnected = false;
            SweetAlert.swal('Chat error', 'Lost connection!', 'error');
            return $state.go('user.dashboard');
        });

        Chat.on("message", function (data) {
            switch (data.verb) {
                case 'created':
                    if (data.statusCode && data.statusCode != 200) return SweetAlert.swal('Chat error', data.body.summary, 'error');
                    $rootScope.messages.push(data.data);
                    break;
                case 'updated':
                    var msg = _.findWhere($rootScope.messages, {id: data.id});
                    if (msg) {
                        msg.likesNum = data.data.likesNum;
                        msg.reportsNum = data.data.reportsNum;
                    }

                    break;
            }
        });

        Chat.on("newUser", function (data) {
            $rootScope.totalChatUsers = data.total;
            $rootScope.messages.push({event: 'connected', user: data.user});
        });

        Chat.on('userDisconnected', function (data) {
            $rootScope.totalChatUsers = data.total;
            $rootScope.messages.push({event: 'disconnected', user: data.user});
        });

        Chat.on('donnaIn', function () {
            $rootScope.donnaOnline = true;
        });

        Chat.on('donnaOut', function () {
            $rootScope.donnaOnline = false;
        });

    }
})();
