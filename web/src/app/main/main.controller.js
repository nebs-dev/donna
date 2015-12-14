(function () {
    'use strict';

    angular
        .module('donna')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController(Chat, $rootScope, SweetAlert, $state, LocalService) {
        var vm = this;

        $rootScope.messages = [];
        vm.chatConnected = false;

        // eventi
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
           //console.log(data);
        });

        Chat.on('userDisconnected', function (data) {
            console.log(data);
        });

    }
})();
